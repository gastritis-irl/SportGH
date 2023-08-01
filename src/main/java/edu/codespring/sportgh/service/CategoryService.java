package edu.codespring.sportgh.service;

import edu.codespring.sportgh.model.Category;

import java.util.Collection;
import java.util.Optional;

public interface CategoryService {

    void save(Category category);

    void delete(Long categoryID);

    void deleteAll();

    boolean existsById(Long categoryID);

    boolean existsByName(String categoryName);

    Long count();

    Collection<Category> findAll();

    Optional<Category> findById(Long categoryID);
}
