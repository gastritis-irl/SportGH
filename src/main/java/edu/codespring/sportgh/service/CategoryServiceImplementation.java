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
public class CategoryServiceImplementation implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public void saveCategory(Category category) {
        if (category.getId() != null && !categoryRepository.existsById(category.getId())) {
            throw new ServiceException("Category with this ID does not exist.");
        }
        if (category.getName() != null && categoryRepository.existsByName(category.getName())) {
            throw new ServiceException("Category with this name already exists.");
        }
        try {
            category = categoryRepository.save(category);
            log.info("Category saved successfully ({}).", category.getName());
        } catch (DataAccessException e) {
            log.error("Category save failed: ({})", e.getMessage());
            throw new ServiceException("Category save failed!", e);
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
