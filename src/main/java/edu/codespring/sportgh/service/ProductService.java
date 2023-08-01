package edu.codespring.sportgh.service;

import edu.codespring.sportgh.model.Product;

import java.util.Collection;

public interface ProductService {

    Collection<Product> findAll();

    void save(Product product);
}
