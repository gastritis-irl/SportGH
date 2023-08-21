package edu.codespring.sportgh.repository;

import edu.codespring.sportgh.model.User;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends BaseRepository<User> {

    @Modifying
    @Query("DELETE FROM User")
    int deleteAllWithCount();

    @Query("select user from User user where user.firebaseUid=:fbUid")
    User findByFirebaseUid(@Param("fbUid") String firebaseUid);

    boolean existsByFirebaseUidAndPassword(String firebaseUid, String passwordHash);

    User findByUsername(String username);
}
