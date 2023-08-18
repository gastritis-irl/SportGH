package edu.codespring.sportgh.service;

import edu.codespring.sportgh.model.Product;

import java.util.Collection;

public interface ProductService {

    Product findById(Long productId);

    Collection<Product> findByCategoryId(Long categoryId);

    Collection<Product> findAll();

    void save(Product product);
}
