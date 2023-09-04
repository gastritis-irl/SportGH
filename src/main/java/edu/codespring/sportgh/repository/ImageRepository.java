package edu.codespring.sportgh.repository;

import edu.codespring.sportgh.model.Image;

public interface ImageRepository extends BaseRepository<Image> {

    boolean existsByName(String name);
}
