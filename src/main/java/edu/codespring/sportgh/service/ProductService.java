package edu.codespring.sportgh.service;

import edu.codespring.sportgh.model.Product;
import edu.codespring.sportgh.model.User;

import java.util.Collection;

public interface ProductService {

    Product findById(Long productId);

    Collection<Product> findByCategoryId(Long categoryId);

    Collection<Product> findAll();

    boolean existsByNameAndUser(String name, User user);

    boolean existsById(Long productId);

    void save(Product product);

    void rent(Product product);
}
