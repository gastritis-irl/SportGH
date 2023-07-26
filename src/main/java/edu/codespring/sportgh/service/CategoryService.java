package edu.codespring.sportgh.service;

import edu.codespring.sportgh.model.Category;

import java.util.Collection;
import java.util.Optional;

public interface CategoryService {

    void saveCategory(Category category);

    void deleteCategory(Long categoryID);

    void deleteAllCategories();

    boolean existsCategory(Long categoryID);

    boolean existsCategory(String categoryName);

    Long countCategories();

    Collection<Category> findAllCategories();

    Optional<Category> findById(Long categoryID);
}
