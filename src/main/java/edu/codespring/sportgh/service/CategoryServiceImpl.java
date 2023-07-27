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
    log.info("Category saved successfully ({}).", category.getName());

  }


  @Override
  public void deleteCategory(Long categoryId) {
    if (categoryRepository.existsById(categoryId)) {
      categoryRepository.deleteById(categoryId);
      log.info("Category deleted successfully (ID: {}).", categoryId);
    } else {
      log.info("Category with ID {} does not exist. Nothing to delete.", categoryId);
    }

  }

  @Override
  public void deleteAllCategories() {
    categoryRepository.deleteAll();
    log.info("All categories deleted successfully.");

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
