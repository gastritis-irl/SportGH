package edu.codespring.sportgh.repository;

import edu.codespring.sportgh.model.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends BaseRepository<User> {

    @Query("select user from User user where user.firebaseUid=:fbUid")
    User findByFirebaseUid(@Param("fbUid") String firebaseUid);

    User findByUsername(String username);

    User findByEmail(String email);
}
