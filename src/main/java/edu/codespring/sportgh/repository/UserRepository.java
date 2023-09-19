package edu.codespring.sportgh.repository;

import edu.codespring.sportgh.model.User;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends BaseRepository<User> {

    @Modifying
    @Query("DELETE FROM User")
    int deleteAllWithCount();

    User findByFirebaseUid( String firebaseUid);

    User findByUsername(String username);

    User findByEmail(String email);
}
