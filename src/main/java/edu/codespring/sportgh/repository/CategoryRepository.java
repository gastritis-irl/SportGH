package edu.codespring.sportgh.repository;

import edu.codespring.sportgh.model.Category;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    Category findByName(String name);

    @Modifying
    @Transactional
    @Query("DELETE FROM Category c WHERE c.id = :id")
    int deleteByIdCustom(Long id);

    @Modifying
    @Transactional
    @Query("DELETE FROM Category")
    int deleteAllCustom();
    boolean existsByName(String name);
}
