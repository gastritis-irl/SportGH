package edu.codespring.sportgh.service;

import edu.codespring.sportgh.model.SubCategory;

import java.util.Collection;

public interface SubCategoryService {

    void save(SubCategory subCategory);

    void delete(Long subCategoryID);

    boolean existsById(Long subCategoryID);

    boolean existsByName(String subCategoryName);

    SubCategory findById(Long subCategoryID);

    SubCategory findByName(String subCategoryName);

    Collection<SubCategory> findAll();

    Collection<SubCategory> findByCategoryId(Long categoryId);
}
