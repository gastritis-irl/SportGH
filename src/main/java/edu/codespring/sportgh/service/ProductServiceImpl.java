package edu.codespring.sportgh.service;

import edu.codespring.sportgh.exception.BadRequestException;
import edu.codespring.sportgh.dto.ProductPageOutDTO;
import edu.codespring.sportgh.mapper.ProductMapper;
import edu.codespring.sportgh.model.Image;
import edu.codespring.sportgh.model.Product;
import edu.codespring.sportgh.model.User;
import edu.codespring.sportgh.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Set;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final ImageService imageService;
    static final int pageSize = 60;

    @Override
    public ProductPageOutDTO findPageByCategoryId(Long categoryId, int pageNumber) {
        Page<Product> page = productRepository.findByCategoryId(categoryId, PageRequest.of(pageNumber - 1, pageSize));

        Collection<Product> products = page.getContent();
        int nrOfPages = page.getTotalPages();
        long nrOfElements = page.getTotalElements();

        return productMapper.productPageToOut(products, nrOfPages, nrOfElements);
    }

    @Override
    public ProductPageOutDTO findPageAll(int pageNumber) {
        Page<Product> page = productRepository.findPageAll(PageRequest.of(pageNumber - 1, pageSize));

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
    public boolean existsByNameAndUser(String name, User user) {
        return productRepository.existsByNameAndUser(name, user);
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

    @Override
    public void delete(Product product) {

        Set<Image> images = product.getImages();
        for (Image image : images) {
            imageService.delete(image.getId());
        }

        productRepository.delete(product);
    }

    @Override
    public void addImage(Long productId, Image image) {

        Product product = findById(productId);
        image.setProduct(product);
        imageService.save(image);
        Set<Image> images=product.getImages();
        if(images.size()>=8){
            throw new BadRequestException("Maximum 8 images can be uploaded");
        }
        images.add(image);
        product.setImages(images);
        save(product);
    }

    @Override
    public void removeImage(Long productId, Long imageId) {
        Product product = findById(productId);
        Image image = imageService.findById(imageId);
        Set<Image> images=product.getImages();
        imageService.delete(imageId);
        images.remove(image);
        product.setImages(images);
        save(product);
    }
}
