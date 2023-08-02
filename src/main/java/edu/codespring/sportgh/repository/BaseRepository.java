package edu.codespring.sportgh.repository;

import edu.codespring.sportgh.model.BaseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface BaseRepository<T extends BaseEntity> extends JpaRepository<T, Long> {

    T findByName(String name);

    boolean existsByName(String name);
}
