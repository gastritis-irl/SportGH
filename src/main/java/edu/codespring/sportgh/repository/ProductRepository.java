package edu.codespring.sportgh.repository;

import edu.codespring.sportgh.model.Product;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;

import edu.codespring.sportgh.model.User;

public interface ProductRepository extends BaseRepository<Product> {

    @Query("select p from Product p where p.subCategory.category.id = :categoryId")
    Collection<Product> findByCategoryId(@Param("categoryId") Long categoryId);

    boolean existsByNameAndUser(String name, User user);
}
