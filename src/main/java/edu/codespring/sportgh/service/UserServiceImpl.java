package edu.codespring.sportgh.service;

import edu.codespring.sportgh.model.User;
import edu.codespring.sportgh.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
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
    public User signup(String email, String firebaseUid) {
        User user = new User();

        user.setEmail(email);
        user.setUsername(email);
        user.setFirebaseUid(firebaseUid);
        userRepository.save(user);
        log.info("Signup successful ({}).", user);
        return user;
    }

    @Override
    @Transactional
    public User update(User user) {
        userRepository.save(user);
        return user;
    }

    @Override
    public Collection<User> findAll() {
        return userRepository.findAll();
    }

    @PreAuthorize("authentication.principal.id == #userId or hasRole('ADMIN')")
    @Override
    public User findById(Long userId) {
        return userRepository.findById(userId).orElse(null);
    }

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public void deleteById(Long userId) {
        userRepository.deleteById(userId);
        log.info("User with ID {} deleted successfully.", userId);
    }
}
