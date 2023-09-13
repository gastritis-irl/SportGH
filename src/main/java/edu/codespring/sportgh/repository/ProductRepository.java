package edu.codespring.sportgh.repository;

import edu.codespring.sportgh.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import edu.codespring.sportgh.model.User;

public interface ProductRepository extends BaseRepository<Product> {

    @Query("select p from Product p where p.subCategory.category.id = :categoryId")
    Page<Product> findByCategoryId(@Param("categoryId") Long categoryId, Pageable pageable);

    Page<Product> findAll(Specification<Product> specification, Pageable pageable);

    @Query("select p from Product p")
    Page<Product> findPageAll(Pageable pageable);

    boolean existsByNameAndUser(String name, User user);
}
