package edu.codespring.sportgh.service;

import edu.codespring.sportgh.model.Product;
import edu.codespring.sportgh.model.User;
import edu.codespring.sportgh.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    int pageNr;
    int pageSize = 24;

    private Page<Product> getByCategoryIdPage(Long categoryId, int pageNumber) {
        return productRepository.findByCategoryId(categoryId, PageRequest.of(pageNumber, pageSize));
    }

    @Override
    public Collection<Product> findByCategoryId(Long categoryId, int pageNumber) {
        return getByCategoryIdPage(categoryId, pageNumber).getContent();
    }

    @Override
    public int getNrOfPagesByCategoryId(Long categoryId) {
        return getByCategoryIdPage(categoryId, pageNr).getTotalPages();
    }

    @Override
    public long getNrOfElementsByCategoryId(Long categoryId) {
        return getByCategoryIdPage(categoryId, pageNr).getTotalElements();
    }

    @Override
    public Product findById(Long productId) {
        return productRepository.findById(productId).orElse(null);
    }

    @Override
    public Collection<Product> findAll() {
        return productRepository.findAll();
    }

    @Override
    public boolean existsByNameAndUser(String name, User user) {
        return productRepository.existsByNameAndUser(name, user);
    }

    @Override
    public void save(Product product) {
        productRepository.save(product);
        log.info("Product saved successfully ({}) with ID: {}", product.getName(), product.getId());
    }
}
