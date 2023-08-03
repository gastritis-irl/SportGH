package edu.codespring.sportgh.repository;

import edu.codespring.sportgh.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByUserName(String userName);

    @Modifying
    @Query("DELETE FROM User")
    int deleteAllWithCount();

    boolean existsByUserName(String userName);

    Optional<User> findByUserNameAndPassword(String userName, String password);

    boolean existsByUserNameAndPassword(String userName, String password);

    @Query("select user.uuid from User user where user.userName=:example")
    String findUuid(@Param("example") String userName);

    @Query("select user from User user where user.firebaseUid=:example")
    User findByFirebaseUid(@Param("example") String firebaseUid);

    boolean existsByFirebaseUid(String firebaseUid);

    @Query("select user.uuid from User user where user.firebaseUid=:example")
    String findUuidByFirebaseUid(@Param("example") String firebaseUid);

    boolean existsByFirebaseUidAndPassword(String firebaseUid, String passwordHash);
}
