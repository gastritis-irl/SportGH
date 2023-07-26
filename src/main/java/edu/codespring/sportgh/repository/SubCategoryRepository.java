package edu.codespring.sportgh.repository;

import edu.codespring.sportgh.model.SubCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubCategoryRepository extends JpaRepository<SubCategory, Long> {

  SubCategory findByName(String name);

  void deleteByName(String name);

  boolean existsByName(String name);
}
