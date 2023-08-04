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
    public User findByFirebaseUid(String firebaseUid) {
        return userRepository.findByFirebaseUid(firebaseUid);
    }

    @Override
    @Transactional
    public User signup(String username, String firebaseUid, String password) {
        if (userRepository.existsByFirebaseUid(firebaseUid)) {
            log.error("User with firebaseUid {} already exists!", firebaseUid);
            return null;
        }
        User user = new User();
        user.setUsername(username);
        user.setFirebaseUid(firebaseUid);
        user.setPassword(PasswordEncrypter.generateHashedPassword(password, user.getUuid()));
        userRepository.save(user);
        log.info("Signup successful ({}).", firebaseUid);
        return user;
    }

    @Override
    public void login(String firebaseUid, String password) {
        String uuid = userRepository.findUuidByFirebaseUid(firebaseUid);
        String passwordHash = PasswordEncrypter.generateHashedPassword(password, uuid);
        if (userRepository.existsByFirebaseUidAndPassword(firebaseUid, passwordHash)) {
            log.info("Login successful ({}).", firebaseUid);
        } else {
            log.error("Invalid credentials for ({})!", firebaseUid);
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
