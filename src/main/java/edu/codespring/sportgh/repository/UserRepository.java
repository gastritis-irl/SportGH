package edu.codespring.sportgh.repository;

import edu.codespring.sportgh.model.User;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends BaseRepository<User> {

    @Modifying
    @Query("DELETE FROM User")
    int deleteAllWithCount();

    boolean existsByNameAndPassword(String name, String password);

    @Query("select user.uuid from User user where user.name=:example")
    String findUuid(@Param("example") String name);
}
