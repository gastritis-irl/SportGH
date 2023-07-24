package edu.codespring.sportgh.service;

import edu.codespring.sportgh.model.Category;

public interface CategoryService {

    void createCategory(String categoryName, String categoryDescription, String categoryImageURL);

    void updateCategory(Long categoryID, String categoryName, String categoryDescription, String categoryImageURL);

    void deleteCategory(Long categoryID);

    void deleteAllCategories();

    boolean existsCategory(Long categoryID);

    boolean existsCategory(String categoryName);

    Long countCategories();

    void findAllCategories();

    Category findCategoryById(Long categoryID);

    Category findCategoryByName(String categoryName);
}
