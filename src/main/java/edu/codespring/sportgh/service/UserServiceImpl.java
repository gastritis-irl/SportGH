package edu.codespring.sportgh.service;

import edu.codespring.sportgh.model.User;
import edu.codespring.sportgh.repository.UserRepository;
import edu.codespring.sportgh.utils.PasswordEncrypter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
        if (userRepository.existsByName(userName)) {
            throw new ServiceException("Signup failed! User with this username already exists.");
        }
        User user = new User();
        user.setName(userName);
        user.setPassword(PasswordEncrypter.generateHashedPassword(password, user.getUuid()));
        userRepository.save(user);
        log.info("Signup successful ({}).", userName);
        return user;

    }

    @Override
    public void login(String userName, String password) {
        String uuid = userRepository.findUuid(userName);
        String passwordHash = PasswordEncrypter.generateHashedPassword(password, uuid);
        if (userRepository.existsByNameAndPassword(userName, passwordHash)) {
            log.info("Login successful ({}).", userName);
        } else {
            log.error("Invalid credentials for ({})!", userName);
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
        log.info("User with ID {} deleted successfully.", userId);
    }

    @Override
    public void deleteAll() {
        int rowsAffected = userRepository.deleteAllWithCount();
        log.info("All users deleted successfully. Rows affected: {}.", rowsAffected);
    }
}
