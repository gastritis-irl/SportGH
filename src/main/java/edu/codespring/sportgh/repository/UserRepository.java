package edu.codespring.sportgh.repository;

import edu.codespring.sportgh.model.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByUserName(String userName);

    @Modifying
    @Transactional
    @Query("DELETE FROM User  u WHERE u.id = :id")
    int deleteByIdCustom(Long id);

    @Modifying
    @Transactional
    @Query("DELETE FROM User")
    int deleteAllCustom();
    boolean existsByUserName(String userName);

    Optional<User> findByUserNameAndPassword(String userName, String password);

    boolean existsByUserNameAndPassword(String userName, String password);

    @Query("select user.uuid from User user where user.userName=:example")
    String findUuid(@Param("example") String userName);
}
