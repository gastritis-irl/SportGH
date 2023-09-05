package edu.codespring.sportgh.service;

import edu.codespring.sportgh.dto.ProductPageOutDTO;
import edu.codespring.sportgh.model.Product;
import edu.codespring.sportgh.model.User;

public interface ProductService {

    Product findById(Long productId);

    ProductPageOutDTO findPageByCategoryId(Long categoryId, int pageNumber);

    ProductPageOutDTO findPageAll(int pageNumber);

    boolean existsByNameAndUser(String name, User user);

    boolean existsById(Long productId);

    void save(Product product);

    void rent(Product product);

    void delete(Product product);
}
