package edu.codespring.sportgh.service;

import edu.codespring.sportgh.dto.ProductInDTO;
import edu.codespring.sportgh.dto.ProductOutDTO;
import edu.codespring.sportgh.dto.ProductPageOutDTO;
import edu.codespring.sportgh.model.FilterOptions;
import edu.codespring.sportgh.model.Product;
import edu.codespring.sportgh.model.User;
import org.springframework.http.ResponseEntity;

public interface ProductService {

    Product findById(Long productId);

    Long findOwnerIdById(Long productId);

    ResponseEntity<ProductOutDTO> saveInDTO(ProductInDTO productOutDTO);

    ProductPageOutDTO findPageByParams(FilterOptions filterOptions);

    boolean notExistsByNameAndUser(String name, User user);

    boolean existsById(Long productId);

    void save(Product product);

    void delete(Product product);
}
