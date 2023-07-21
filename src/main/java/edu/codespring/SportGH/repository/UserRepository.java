package edu.codespring.SportGH.repository;

import edu.codespring.SportGH.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUserName(String userName);

    void deleteByUserName(String userName);

    boolean existsByUserName(String userName);

    Optional<User> findByUserNameAndPassword(String userName, String password);

    boolean existsByUserNameAndPassword(String userName, String password);

    @Query("select user.uuid from User user where user.userName=:example")
    String findUuid(@Param("example") String userName);
}
