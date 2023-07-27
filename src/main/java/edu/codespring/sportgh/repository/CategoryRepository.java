package edu.codespring.sportgh.repository;

import edu.codespring.sportgh.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {

  Category findByName(String name);

  void deleteByName(String name);

  boolean existsByName(String name);
}
