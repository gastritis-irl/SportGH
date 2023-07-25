package edu.codespring.sportgh.service;

import edu.codespring.sportgh.model.Category;

import java.util.Collection;

public interface CategoryService {

    void createCategory(String categoryName, String categoryDescription, String categoryImageURL);

    void updateCategory(Long categoryID, String categoryName, String categoryDescription, String categoryImageURL);

    void deleteCategory(Long categoryID);

    void deleteAllCategories();

    boolean existsCategory(Long categoryID);

    boolean existsCategory(String categoryName);

    Long countCategories();

    Collection<Category> findAllCategories();

    Category findById(Long categoryID);
}
