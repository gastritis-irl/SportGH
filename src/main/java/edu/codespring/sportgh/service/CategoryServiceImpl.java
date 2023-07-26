package edu.codespring.sportgh.service;

import edu.codespring.sportgh.model.Category;
import edu.codespring.sportgh.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
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
    try {
      categoryRepository.save(category);
      log.info("Category saved successfully ({}).", category.getName());
    } catch (DataAccessException e) {
      log.error("Category save failed: ({})", e.getMessage());
      throw new ServiceException("Category save failed!", e);
    }
  }


  @Override
  public void deleteCategory(Long categoryId) {
    try {
      if (categoryRepository.existsById(categoryId)) {
        categoryRepository.deleteById(categoryId);
        log.info("Category deleted successfully (ID: {}).", categoryId);
      } else {
        log.info("Category with ID {} does not exist. Nothing to delete.", categoryId);
      }
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
  public Optional<Category> findById(Long categoryId) {
    try {
      return categoryRepository.findById(categoryId);
    } catch (DataAccessException e) {
      log.error("Failed to find category by ID: ({})", e.getMessage());
      throw new ServiceException("Failed to find category!", e);
    }
  }
}
