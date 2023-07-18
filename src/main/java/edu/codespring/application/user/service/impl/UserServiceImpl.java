package edu.codespring.application.user.service.impl;

import edu.codespring.application.user.model.User;
import edu.codespring.application.user.repository.UserRepository;
import edu.codespring.application.user.service.ServiceException;
import edu.codespring.application.user.service.UserService;
import edu.codespring.application.user.utils.PasswordEncrypter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    @PersistenceContext
    private final EntityManager entityManager;

    @Override
    @Transactional
    public User signup(String userName, String password) {
        if (userRepository.existsByUserName(userName)) {
            userRepository.deleteByUserName(userName);
            entityManager.flush();
        }
        try {
            User user = new User();
            user.setUserName(userName);
            user.setPassword(PasswordEncrypter.generateHashedPassword(password, user.getUuid()));
            userRepository.save(user);
            return user;
        } catch (DataAccessException e) {
            log.error("Signup failed!");
            throw new ServiceException("Signup failed!", e);
        }

    }

    @Override
    public void login(String userName, String password) {
        try {
            String uuid = userRepository.findUuid(userName);
            String passwordHash = PasswordEncrypter.generateHashedPassword(password, uuid);
            // Optional<User> user = userRepository.findByUserNameAndPassword
            // (userName, PasswordEncrypter.generateHashedPassword(password, uuid));
            if (userRepository.existsByUserNameAndPassword(userName, passwordHash)) {
                log.info("Login successful");
            } else {
                log.error("Login failed");
            }
        } catch (DataAccessException e) {
            log.error("Login failed!");
            throw new ServiceException("Login failed!", e);
        }

    }

    @Override
    public Collection<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public User findById(Long userId) {
        return userRepository.findById(userId).orElse(null);
    }

    @Override
    public void deleteById(Long userId) {
        userRepository.deleteById(userId);
    }
}
