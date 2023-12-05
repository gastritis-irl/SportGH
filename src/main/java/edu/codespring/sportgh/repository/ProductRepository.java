package edu.codespring.sportgh.repository;

import edu.codespring.sportgh.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import edu.codespring.sportgh.model.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends BaseRepository<Product> {

    Page<Product> findAll(Specification<Product> specification, Pageable pageable);

    boolean existsByNameAndUser(String name, User user);

    @Query("select p.user.id from Product p where p.id = :productId")
    Long findUserIdById(@Param("productId") Long productId);
}
