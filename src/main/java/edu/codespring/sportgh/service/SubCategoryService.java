package edu.codespring.sportgh.service;

import edu.codespring.sportgh.model.SubCategory;

import java.util.Collection;

public interface SubCategoryService {

    void save(SubCategory subCategory);

    void delete(Long subCategoryID);

    void deleteAll();

    boolean existsById(Long subCategoryID);

    boolean existsByName(String subCategoryName);

    SubCategory findById(Long subCategoryID);

    Long count();

    Collection<SubCategory> findAll();

    Collection<SubCategory> findByIds(Collection<Long> subCategoryIDs);

    Collection<SubCategory> findByCategoryId(Long categoryId);
}
