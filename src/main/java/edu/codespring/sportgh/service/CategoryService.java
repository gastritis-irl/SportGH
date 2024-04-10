package edu.codespring.sportgh.service;

import edu.codespring.sportgh.model.Category;

import java.util.Collection;

public interface CategoryService {

    void save(Category category);

    void delete(Long categoryID);

    boolean existsById(Long categoryID);

    boolean existsByName(String categoryName);

    Collection<Category> findAll();

    Category findById(Long categoryID);

    Category findByName(String categoryName);
}
