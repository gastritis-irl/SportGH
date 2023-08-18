package edu.codespring.sportgh.repository;

import edu.codespring.sportgh.model.Product;
import edu.codespring.sportgh.model.User;

public interface ProductRepository extends BaseRepository<Product> {

    boolean existsByNameAndUser(String name, User user);
}
