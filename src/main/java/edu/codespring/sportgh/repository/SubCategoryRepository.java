package edu.codespring.sportgh.repository;

import edu.codespring.sportgh.model.SubCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;

public interface SubCategoryRepository extends JpaRepository<SubCategory, Long> {

    SubCategory findByName(String name);

    @Modifying
    @Query("DELETE FROM SubCategory")
    int deleteAllWithCount();

    boolean existsByName(String name);

    Collection<SubCategory> findByIdIn(Collection<Long> subCategoryIDs);

    Collection<SubCategory> findByCategoryId(Long categoryId);
}
