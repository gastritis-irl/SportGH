package edu.codespring.sportgh.service;

public interface CategoryService {

    void createCategory(String categoryName, String categoryDescription, String categoryImageURL);

    void updateCategory(Long categoryID, String categoryName, String categoryDescription, String categoryImageURL);

    void deleteCategory(Long categoryID);

    void deleteAllCategories();

    boolean existsCategory(Long categoryID);

    boolean existsCategory(String categoryName);

    Long countCategories();

    void findAllCategories();

    void findCategoryById(Long categoryID);

    void findCategoryByName(String categoryName);

    void findCategoryByDescription(String categoryDescription);
}
