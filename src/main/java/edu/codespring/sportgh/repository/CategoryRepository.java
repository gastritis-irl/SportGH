package edu.codespring.sportgh.repository;

import edu.codespring.sportgh.model.Category;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    Category findByName(String name);

    void deleteById(Long id);

    @Modifying
    @Query("DELETE FROM Category")
    int deleteAllWithCount();

    boolean existsByName(String name);
}
