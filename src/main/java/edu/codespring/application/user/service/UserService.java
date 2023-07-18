package edu.codespring.application.user.service;

import edu.codespring.application.user.model.User;

import java.util.Collection;

public interface UserService {
    User signup(String userName, String password);

    void login(String userName, String password);

    Collection<User> findAll();

    User findById(Long userId);

    void deleteById(Long userId);
}

