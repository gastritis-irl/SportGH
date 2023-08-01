package edu.codespring.sportgh.repository;

import edu.codespring.sportgh.model.SubCategory;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;

public interface SubCategoryRepository extends BaseRepository<SubCategory> {

    @Modifying
    @Query("DELETE FROM SubCategory")
    Integer deleteAllWithCount();

    Collection<SubCategory> findByIdIn(Collection<Long> subCategoryIDs);

    Collection<SubCategory> findByCategoryId(Long categoryId);
}
