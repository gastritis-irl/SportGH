package edu.codespring.sportgh.service;

import edu.codespring.sportgh.dto.ProductPageOutDTO;
import edu.codespring.sportgh.model.Product;
import edu.codespring.sportgh.model.User;

public interface ProductService {

    Product findById(Long productId);

    ProductPageOutDTO findPageByParams(
        String orderBy,
        String direction,
        int pageNumber,
        String[] subcategoryNames,
        Double minPrice,
        Double maxPrice,
        String textSearch
    );

    boolean notExistsByNameAndUser(String name, User user);

    boolean existsById(Long productId);

    void save(Product product);

    void delete(Product product);
}
