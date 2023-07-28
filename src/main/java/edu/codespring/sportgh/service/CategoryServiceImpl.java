package edu.codespring.sportgh.service;

import edu.codespring.sportgh.model.Category;
import edu.codespring.sportgh.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public void saveCategory(Category category) {
        categoryRepository.save(category);
        log.info("Category saved successfully ({}) with ID: ({}).", category.getName(), category.getId());
    }

    @Override
    public void deleteCategory(Long categoryId) {
        int rowsAffected = categoryRepository.deleteByIdCustom(categoryId);
        log.info("Category with ID {} deleted successfully. Rows affected: {}.", categoryId, rowsAffected);
    }

    @Override
    public void deleteAllCategories() {
        int rowsAffected = categoryRepository.deleteAllCustom();
        log.info("All categories deleted successfully. Rows affected: {}.", rowsAffected);
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
    public Optional<Category> findById(Long categoryId) {
        return categoryRepository.findById(categoryId);

    }
}
