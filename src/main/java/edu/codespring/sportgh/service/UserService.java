package edu.codespring.sportgh.service;

import edu.codespring.sportgh.model.User;

import java.util.Collection;

public interface UserService {

    User signup(String userName, String firebaseUid, String password);

    void login(String firebaseUid, String password);

    User update(User user);

    Collection<User> findAll();

    User findById(Long userId);

    User findByUsername(String username);

    void deleteById(Long userId);

    void deleteAll();

    User findByFirebaseUid(String firebaseUid);
}

