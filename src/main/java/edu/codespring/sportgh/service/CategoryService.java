package edu.codespring.sportgh.service;

import edu.codespring.sportgh.model.Category;

import java.util.Collection;

public interface CategoryService {

    void save(Category category);

    void delete(Long categoryID);

    void deleteAll();

    boolean existsById(Long categoryID);

    boolean existsByName(String categoryName);

    Long count();

    Collection<Category> findAll();

    Category findById(Long categoryID);
}
