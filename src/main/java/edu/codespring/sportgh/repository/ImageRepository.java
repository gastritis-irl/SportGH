package edu.codespring.sportgh.repository;

import edu.codespring.sportgh.model.Image;

import java.util.Collection;

public interface ImageRepository extends BaseRepository<Image> {

    Collection<Image> findByProductId(Long productId);

    void deleteByProductId(Long productId);
}
