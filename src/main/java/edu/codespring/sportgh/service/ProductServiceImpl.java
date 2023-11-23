package edu.codespring.sportgh.service;

import edu.codespring.sportgh.dto.ProductInDTO;
import edu.codespring.sportgh.dto.ProductOutDTO;
import edu.codespring.sportgh.dto.ProductPageOutDTO;
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

    private Specification<Product> filterByUserId(
            Long userId, Specification<Product> specification
    ) {
        Specification<Product> spec = specification;
        if (userId != null) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("user").get("id"), userId)
            );
        }
        return spec;
    }

    private Specification<Product> filterByLocation(Double locationLat,
                                                    Double locationLng,
                                                    Double locationRadius,
                                                    Specification<Product> specification) {
        Specification<Product> spec = specification;
        if (locationLat != null) {
            try {
                spec = spec.and((root, query, criteriaBuilder) -> {
                            if (root.get("locationLat") == null || root.get("locationLng") == null) {
                                return criteriaBuilder.isTrue(criteriaBuilder.literal(false));
                            }

                            // Haversine formula
                            double dbLocLat = Double.parseDouble(root.get("locationLat").toString());
                            double dbLocLng = Double.parseDouble(root.get("locationLng").toString());
                            double dLat = dbLocLat - locationLat;
                            double dLng = dbLocLng - locationLng;

                            double r = 6371.0;    // Earth's mean radius in kms
                            double a = Math.pow(Math.sin(dLat / 2), 2)
                                    + Math.cos(locationLat) * Math.cos(dbLocLat) * Math.pow(Math.sin(dLng / 2), 2);
                            double c = 2 * Math.pow(Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)), 2);
                            double d = r * c;

                            return criteriaBuilder.isTrue(criteriaBuilder.literal(d < locationRadius));
                        }
                );
            } catch (NumberFormatException e) {
                log.error("Error parsing location coordinates to Double", e);
                return spec;
            }
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
            String textSearch,
            Double locationLat,
            Double locationLng,
            Double locationRadius,
            Long userId
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

        specification = filterByUserId(userId, specification);
        specification = filterBySubcategories(subcategoryNames, specification);
        specification = filterByPrice(minPrice, maxPrice, specification);
        specification = filterByTextInNameOrDescription(textSearch, specification);
        specification = filterByLocation(locationLat, locationLng, locationRadius, specification);

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

    @Transactional
    @Override
    public void delete(Product product) {
        imageService.deleteByProductId(product.getId());
        productRepository.delete(product);
    }
}
