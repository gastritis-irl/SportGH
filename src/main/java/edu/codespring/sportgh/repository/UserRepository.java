package edu.codespring.sportgh.repository;

import edu.codespring.sportgh.model.User;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends BaseRepository<User> {

    @Modifying
    @Query("DELETE FROM User")
    int deleteAllWithCount();

    boolean existsByUsernameAndPassword(String name, String password);

    boolean existsByUsername(String name);

    @Query("select user.uuid from User user where user.username=:example")
    String findUuid(@Param("example") String name);
}
