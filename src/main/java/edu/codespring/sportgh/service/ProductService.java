package edu.codespring.sportgh.service;

import edu.codespring.sportgh.dto.ProductPageOutDTO;
import edu.codespring.sportgh.model.Product;
import edu.codespring.sportgh.model.User;

import java.util.Collection;

public interface ProductService {

    Product findById(Long productId);

    ProductPageOutDTO findPageByCategoryId(Long categoryId, int pageNumber);

    Collection<Product> findAll();

    boolean existsByNameAndUser(String name, User user);

    boolean existsById(Long productId);

    void save(Product product);

    void rent(Product product);

    void delete(Product product);
}
