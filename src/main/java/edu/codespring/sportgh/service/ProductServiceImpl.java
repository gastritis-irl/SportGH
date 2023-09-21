package edu.codespring.sportgh.service;

import edu.codespring.sportgh.dto.ProductInDTO;
import edu.codespring.sportgh.dto.ProductOutDTO;
import edu.codespring.sportgh.dto.ProductPageOutDTO;
import edu.codespring.sportgh.exception.BadRequestException;
import edu.codespring.sportgh.mapper.ProductMapper;
import edu.codespring.sportgh.model.Product;
import edu.codespring.sportgh.model.User;
import edu.codespring.sportgh.repository.ProductRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    static final int pageSize = 60;

    private ImageService imageService;

    @Autowired
    public void setImageService(@Lazy ImageService imageService) {
        this.imageService = imageService;
    }

    @PreAuthorize("authentication.principal.id == #productInDTO.userId or hasRole('ADMIN')")
    @PostAuthorize("returnObject.body.userId == authentication.principal.id or hasRole('ADMIN')")
    @Override
    @Transactional
    public ResponseEntity<ProductOutDTO> saveInDTO(@Valid ProductInDTO productInDTO) {
        Product product = productMapper.dtoToProduct(productInDTO);
        save(product);
        ProductOutDTO productOutDTO = productMapper.productToOut(product);
        return new ResponseEntity<>(productOutDTO, HttpStatus.OK);
    }

    private Specification<Product> filterByPrice(
        Double minPrice, Double maxPrice, Specification<Product> specification
    ) {
        Specification<Product> spec = specification;
        if (minPrice != null && minPrice != 0) {
            spec = spec.and((root, query, criteriaBuilder) ->
                criteriaBuilder.greaterThanOrEqualTo(root.get("rentPrice"), minPrice));
        }

        if (maxPrice != null && maxPrice != 0) {
            spec = spec.and((root, query, criteriaBuilder) ->
                criteriaBuilder.lessThanOrEqualTo(root.get("rentPrice"), maxPrice));
        }

        return spec;
    }

    private Specification<Product> filterBySubcategories(
            String[] subcategoryNames, Specification<Product> specification
    ) {
        Specification<Product> spec = specification;

        if (subcategoryNames != null && subcategoryNames.length > 0) {
            spec = spec.and((root, query, criteriaBuilder) ->
                root.get("subCategory").get("name").in((Object[]) subcategoryNames));
        }
        return spec;
    }

    private Specification<Product> filterByTextInNameOrDescription(
        String textSearch, Specification<Product> specification
    ) {
        Specification<Product> spec = specification;
        if (textSearch != null) {
            spec = spec.and((root, query, criteriaBuilder) ->
                criteriaBuilder.or(
                    criteriaBuilder.like(root.get("name"), "%" + textSearch + "%"),
                    criteriaBuilder.like(root.get("description"), "%" + textSearch + "%")
                )
            );
        }
        return spec;
    }

    @Override
    public ProductPageOutDTO findPageByParams(
        String orderBy,
        String direction,
        int pageNumber,
        String[] subcategoryNames,
        Double minPrice,
        Double maxPrice,
        String textSearch
    ) {
        Specification<Product> specification = Specification.where(null);

        Pageable pageable;
        if (orderBy == null) {
            pageable = PageRequest.of(pageNumber - 1, pageSize);
        } else {
            if (direction == null) {
                pageable = PageRequest.of(
                    pageNumber - 1,
                    pageSize,
                    Sort.by(Sort.DEFAULT_DIRECTION, orderBy)
                );
            } else {
                pageable = PageRequest.of(
                    pageNumber - 1,
                    pageSize,
                    Sort.by(Sort.Direction.fromString(direction), orderBy)
                );
            }
        }

        specification = filterBySubcategories(subcategoryNames, specification);
        specification = filterByPrice(minPrice, maxPrice, specification);
        specification = filterByTextInNameOrDescription(textSearch, specification);

        Page<Product> page = productRepository.findAll(specification, pageable);

        Collection<Product> products = page.getContent();
        int nrOfPages = page.getTotalPages();
        long nrOfElements = page.getTotalElements();

        return productMapper.productPageToOut(products, nrOfPages, nrOfElements);
    }

    @Override
    public Product findById(Long productId) {
        return productRepository.findById(productId).orElse(null);
    }

    @Override
    public boolean notExistsByNameAndUser(String name, User user) {
        return !productRepository.existsByNameAndUser(name, user);
    }

    @Override
    public boolean existsById(Long productId) {
        return productRepository.existsById(productId);
    }

    @Override
    public void save(Product product) {
        productRepository.save(product);
        log.info("Product saved successfully ({}) with ID: {}", product.getName(), product.getId());
    }

    @Override
    public void rent(Product product) {
        if (product.isAvailable()) {
            product.setAvailable(false);
            save(product);
        } else {
            throw new BadRequestException("This product is currently unavailable.");
        }
    }

    @PreAuthorize("#product.user.id == authentication.principal.id or hasRole('ADMIN')")
    @Transactional
    @Override
    public void delete(Product product) {
        imageService.deleteByProductId(product.getId());
        productRepository.delete(product);
    }
}
