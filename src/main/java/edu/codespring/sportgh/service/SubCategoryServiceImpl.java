package edu.codespring.sportgh.service;

import edu.codespring.sportgh.model.SubCategory;
import edu.codespring.sportgh.repository.SubCategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Slf4j
@Service
@RequiredArgsConstructor
public class SubCategoryServiceImpl implements SubCategoryService {

  private final SubCategoryRepository subCategoryRepository;

  @Override
  public void save(SubCategory subCategory) {
    subCategoryRepository.save(subCategory);
    log.info("SubCategory saved successfully ({}).", subCategory.getName());
  }

  @Override
  public void delete(Long subCategoryID) {
    if (subCategoryRepository.existsById(subCategoryID)) {
      subCategoryRepository.deleteById(subCategoryID);
      log.info("SubCategory deleted successfully (ID: {}).", subCategoryID);
    } else {
      log.info("SubCategory with ID {} does not exist. Nothing to delete.", subCategoryID);
    }
  }

  @Override
  public void deleteAll() {
    subCategoryRepository.deleteAll();
    log.info("All SubCategories deleted successfully.");
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
    return subCategoryRepository.findByIdIn(subCategoryIDs);
  }
}
