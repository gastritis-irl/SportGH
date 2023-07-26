package edu.codespring.sportgh.service;

import edu.codespring.sportgh.model.User;
import edu.codespring.sportgh.repository.UserRepository;
import edu.codespring.sportgh.utils.PasswordEncrypter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public User signup(String userName, String password) {
        if (userRepository.existsByUserName(userName)) {
            throw new ServiceException("Signup failed! User with this username already exists.");
        }
        try {
            User user = new User();
            user.setUserName(userName);
            user.setPassword(PasswordEncrypter.generateHashedPassword(password, user.getUuid()));
            userRepository.save(user);
            log.info("Signup successful ({}).", userName);
            return user;
        } catch (DataAccessException e) {
            log.error("Signup failed: ({})", e.getMessage());
            throw new ServiceException("Signup failed!", e);
        }

    }

    @Override
    public void login(String userName, String password) {
        try {
            String uuid = userRepository.findUuid(userName);
            String passwordHash = PasswordEncrypter.generateHashedPassword(password, uuid);
            if (userRepository.existsByUserNameAndPassword(userName, passwordHash)) {
                log.info("Login successful ({}).", userName);
            } else {
                log.error("Invalid credentials for ({})!", userName);
            }
        } catch (DataAccessException e) {
            log.error("Login failed for ({})!\nERROR: ({})", userName, e.getMessage());
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

    @Override
    public void deleteAll() {
        userRepository.deleteAll();
    }
}
