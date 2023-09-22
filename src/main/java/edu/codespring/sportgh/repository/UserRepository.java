package edu.codespring.sportgh.repository;

import edu.codespring.sportgh.model.User;

public interface UserRepository extends BaseRepository<User> {

    User findByFirebaseUid( String firebaseUid);

    User findByUsername(String username);

    User findByEmail(String email);
}
