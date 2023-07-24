package edu.codespring.sportgh.service;

import edu.codespring.sportgh.model.Category;
import edu.codespring.sportgh.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

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
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public void deleteCategory(Long categoryID) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public void deleteAllCategories() {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public boolean existsCategory(Long categoryID) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public boolean existsCategory(String categoryName) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public Long countCategories() {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public void findAllCategories() {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public void findCategoryById(Long categoryID) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public void findCategoryByName(String categoryName) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public void findCategoryByDescription(String categoryDescription) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }
}
