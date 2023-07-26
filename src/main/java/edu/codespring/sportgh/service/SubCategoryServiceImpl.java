package edu.codespring.sportgh.service;

import edu.codespring.sportgh.model.SubCategory;
import edu.codespring.sportgh.repository.SubCategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Slf4j
@Service
@RequiredArgsConstructor
public class SubCategoryServiceImpl implements SubCategoryService{

  private final SubCategoryRepository subCategoryRepository;

  @Override
  public void save(SubCategory subCategory) {
    try {
      subCategoryRepository.save(subCategory);
      log.info("SubCategory saved successfully ({}).", subCategory.getName());
    } catch (DataAccessException e) {
      log.error("SubCategory save failed: ({})", e.getMessage());
      throw new ServiceException("SubCategory save failed!", e);
    }
  }

  @Override
  public void delete(Long subCategoryID) {
    try {
      if (subCategoryRepository.existsById(subCategoryID)) {
        subCategoryRepository.deleteById(subCategoryID);
        log.info("SubCategory deleted successfully (ID: {}).", subCategoryID);
      } else {
        log.info("SubCategory with ID {} does not exist. Nothing to delete.", subCategoryID);
      }
    } catch (DataAccessException e) {
      log.error("SubCategory deletion failed: ({})", e.getMessage());
      throw new ServiceException("SubCategory deletion failed!", e);
    }
  }

  @Override
  public void deleteAll() {
    try {
      subCategoryRepository.deleteAll();
      log.info("All SubCategories deleted successfully.");
    } catch (DataAccessException e) {
      log.error("SubCategory deletion failed: ({})", e.getMessage());
      throw new ServiceException("SubCategory deletion failed!", e);
    }
  }

  @Override
  public boolean existsById(Long subCategoryID) {
    return subCategoryRepository.existsById(subCategoryID);
  }

  @Override
  public boolean existsByName(String subCategoryName) {
    return subCategoryRepository.existsByName(subCategoryName);
  }

  @Override
  public Long count() {
    return subCategoryRepository.count();
  }

  @Override
  public Collection<SubCategory> findAll() {
    return subCategoryRepository.findAll();
  }

    @Override
  public Collection<SubCategory> findByIds(Collection<Long> subCategoryIDs) {
    try{
      return subCategoryRepository.findByIdIn(subCategoryIDs);
    } catch (DataAccessException e) {
      log.error("SubCategory find failed: ({})", e.getMessage());
      throw new ServiceException("SubCategory find failed!", e);
    }
  }
}
