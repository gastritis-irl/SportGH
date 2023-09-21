package edu.codespring.sportgh.service;

import edu.codespring.sportgh.model.User;

import java.util.Collection;

public interface UserService {

    User signup(String email, String firebaseUid, String role);

    User update(User user);

    Collection<User> findAll();

    User findById(Long userId);

    User findByUsername(String username);

    void deleteById(Long userId);

    User findByFirebaseUid(String firebaseUid);
}

