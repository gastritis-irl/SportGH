package edu.codespring.sportgh.service;

import edu.codespring.sportgh.model.Product;
import edu.codespring.sportgh.model.User;

import java.util.Collection;

public interface ProductService {

    Product findById(Long productId);

    Collection<Product> findAll();

    boolean existsByNameAndUser(String name, User user);

    void save(Product product);
}
