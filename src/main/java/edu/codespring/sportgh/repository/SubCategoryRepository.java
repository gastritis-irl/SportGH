package edu.codespring.sportgh.repository;

import edu.codespring.sportgh.model.SubCategory;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;

public interface SubCategoryRepository extends JpaRepository<SubCategory, Long> {

    SubCategory findByName(String name);

    @Modifying
    @Transactional
    @Query("DELETE FROM SubCategory s WHERE s.id = :id")
    int deleteByIdCustom(Long id);

    @Modifying
    @Transactional
    @Query("DELETE FROM SubCategory")
    int deleteAllCustom();

    boolean existsByName(String name);

    Collection<SubCategory> findByIdIn(Collection<Long> subCategoryIDs);

    Collection<SubCategory> findByCategoryId(Long categoryId);
}
