package edu.codespring.sportgh.service;

import edu.codespring.sportgh.model.SubCategory;

import java.util.Collection;
import java.util.Optional;

public interface SubCategoryService {

  void save(SubCategory subCategory);

  void delete(Long subCategoryID);

  void deleteAll();

  boolean existsById(Long subCategoryID);

  boolean existsByName(String subCategoryName);

  Long count();

  Collection<SubCategory> findAll();

  Optional<SubCategory> findById(Long subCategoryID);
}
