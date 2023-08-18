package edu.codespring.sportgh.service;

import edu.codespring.sportgh.model.Category;
import edu.codespring.sportgh.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
@Slf4j
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public void save(Category category) {
        categoryRepository.save(category);
        log.info("Category saved successfully ({}) with ID: ({}).", category.getName(), category.getId());
    }

    @Override
    public void delete(Long categoryId) {
        categoryRepository.deleteById(categoryId);
        log.info("Category with ID {} deleted successfully.", categoryId);
    }

    @Override
    public void deleteAll() {
        int rowsAffected = categoryRepository.deleteAllWithCount();
        log.info("All categories deleted successfully. Rows affected: {}.", rowsAffected);
    }

    @Override
    public boolean existsById(Long categoryID) {
        return categoryRepository.existsById(categoryID);
    }

    @Override
    public boolean existsByName(String categoryName) {
        return categoryRepository.existsByName(categoryName);
    }

    @Override
    public Long count() {
        return categoryRepository.count();
    }

    @Override
    public Collection<Category> findAll() {
        return categoryRepository.findAll();
    }

    @Override
    public Category findById(Long categoryId) {
        return categoryRepository.findById(categoryId).orElse(null);
    }

    @Override
    public Category findByName(String categoryName) {
        return categoryRepository.findByName(categoryName);
    }
}
