package edu.codespring.sportgh.service;

import edu.codespring.sportgh.model.Product;

import java.util.Collection;
import java.util.Optional;

public interface ProductService {

    Optional<Product> findById(Long productId);

    Collection<Product> findAll();

    void save(Product product);
}
