package edu.codespring.sportgh.repository;

import edu.codespring.sportgh.model.Image;

import java.util.Optional;

public interface ImageRepository extends BaseRepository<Image> {
    boolean existsByName(String name);
}
