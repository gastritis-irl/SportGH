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
        int rowsAffected = subCategoryRepository.deleteByIdCustom(subCategoryID);
        log.info("Category with ID {} deleted successfully. Rows affected: {}.", subCategoryID, rowsAffected);
    }

    @Override
    public void deleteAll() {
        int rowsAffected = subCategoryRepository.deleteAllCustom();
        log.info("All categories deleted successfully. Rows affected: {}.", rowsAffected);
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

    @Override
    public Collection<SubCategory> findByCategoryId(Long categoryId) {
        return subCategoryRepository.findByCategoryId(categoryId);
    }
}
