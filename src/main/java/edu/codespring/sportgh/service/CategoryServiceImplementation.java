package edu.codespring.sportgh.service;

import edu.codespring.sportgh.model.Category;
import edu.codespring.sportgh.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
@Slf4j
@RequiredArgsConstructor
public class CategoryServiceImplementation implements CategoryService{

    private final CategoryRepository categoryRepository;
    @Override
    public void createCategory(String categoryName, String categoryDescription, String categoryImageURL) {
        if (categoryRepository.existsByName(categoryName)) {
            throw new ServiceException("Category with this name already exists.");
        }
        try {
            Category category = new Category();
            category.setName(categoryName);
            category.setDescription(categoryDescription);
            category.setImageURL(categoryImageURL);
            categoryRepository.save(category);
            log.info("Category created successfully ({}).", categoryName);
        } catch (DataAccessException e) {
            log.error("Category creation failed: ({})", e.getMessage());
            throw new ServiceException("Category creation failed!", e);
        }
    }

    @Override
    public void updateCategory(Long categoryID, String categoryName, String categoryDescription, String categoryImageURL) {
        if (!categoryRepository.existsById(categoryID)) {
            throw new ServiceException("Category with this ID does not exist.");
        }
        try {
            Category category = categoryRepository.findById(categoryID).get();
            category.setName(categoryName);
            category.setDescription(categoryDescription);
            category.setImageURL(categoryImageURL);
            categoryRepository.save(category);
            log.info("Category updated successfully ({}).", categoryName);
        } catch (DataAccessException e) {
            log.error("Category update failed: ({})", e.getMessage());
            throw new ServiceException("Category update failed!", e);
        }
    }

    @Override
    public void deleteCategory(Long categoryID) {
        if (!categoryRepository.existsById(categoryID)) {
            throw new ServiceException("Category with this ID does not exist.");
        }
        try {
            Category category = categoryRepository.findById(categoryID).get();
            categoryRepository.delete(category);
            log.info("Category deleted successfully ({}).", category.getName());
        } catch (DataAccessException e) {
            log.error("Category deletion failed: ({})", e.getMessage());
            throw new ServiceException("Category deletion failed!", e);
        }
    }

    @Override
    public void deleteAllCategories() {
        try {
            categoryRepository.deleteAll();
            log.info("All categories deleted successfully.");
        } catch (DataAccessException e) {
            log.error("Category deletion failed: ({})", e.getMessage());
            throw new ServiceException("Category deletion failed!", e);
        }
    }

    @Override
    public boolean existsCategory(Long categoryID) {
        return categoryRepository.existsById(categoryID);
    }

    @Override
    public boolean existsCategory(String categoryName) {
        return categoryRepository.existsByName(categoryName);
    }

    @Override
    public Long countCategories() {
        return categoryRepository.count();
    }

    @Override
    public Collection<Category> findAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Category findById(Long categoryID) {
        return categoryRepository.findById(categoryID).orElse(null);
    }
}
