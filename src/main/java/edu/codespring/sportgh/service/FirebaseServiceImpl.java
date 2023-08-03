package edu.codespring.sportgh.service;

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import edu.codespring.sportgh.model.User;
import edu.codespring.sportgh.repository.UserRepository;
import edu.codespring.sportgh.utils.FirebaseTokenHolder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class FirebaseServiceImpl implements FirebaseService {

    private final UserRepository userRepository;

    @Override
    public String parseToken(String idToken) {
        FirebaseTokenHolder tokenHolder = verifyTokenAndReturnTokenHolder(idToken);
        return getFirebaseUid(tokenHolder);
    }

    public String getFirebaseUid(FirebaseTokenHolder tokenHolder) {
        return tokenHolder.getUid();
    }


    @Override
    public FirebaseToken verifyToken(String idToken) {
        try {
            return FirebaseAuth.getInstance().verifyIdToken(idToken);
        } catch (FirebaseAuthException e) {
            log.error("Invalid firebase token", e);
            throw new ServiceException("Invalid firebase token", e);
        }
    }

    @Override
    public FirebaseToken verifyToken(String idToken, boolean checkRevoked) {
        try {
            return FirebaseAuth.getInstance().verifyIdToken(idToken, checkRevoked);
        } catch (FirebaseAuthException e) {
            log.error("Invalid firebase token", e);
            throw new ServiceException("Invalid firebase token", e);
        }
    }

    @Override
    public FirebaseTokenHolder verifyTokenAndReturnTokenHolder(String idToken) {
        try {
            FirebaseToken token = FirebaseAuth.getInstance().verifyIdToken(idToken);
            return new FirebaseTokenHolder(token);
        } catch (FirebaseAuthException e) {
            log.error("Invalid firebase token", e);
            throw new ServiceException("Invalid firebase token", e);
        }
    }

    @Override
    public FirebaseTokenHolder verifyTokenAndReturnTokenHolder(String idToken, boolean checkRevoked) {
        try {
            FirebaseToken token = FirebaseAuth.getInstance().verifyIdToken(idToken, checkRevoked);
            return new FirebaseTokenHolder(token);
        } catch (FirebaseAuthException e) {
            log.error("Invalid firebase token", e);
            throw new ServiceException("Invalid firebase token", e);
        }
    }

    public FirebaseTokenHolder verifyTokenAndReturnTokenHolder(String idToken, String firebaseApp) {
        try {
            FirebaseToken token = FirebaseAuth.getInstance(FirebaseApp.getInstance(firebaseApp)).verifyIdToken(idToken);
            return new FirebaseTokenHolder(token);
        } catch (FirebaseAuthException e) {
            log.error("Invalid firebase token", e);
            throw new ServiceException("Invalid firebase token", e);
        }
    }

    @Override
    public Authentication getAuthentication(String idToken) {
        // Verify the ID token using the Firebase SDK
        FirebaseToken firebaseToken;
        try {
            firebaseToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
        } catch (FirebaseAuthException e) {
            throw new BadCredentialsException("Failed to verify the Firebase ID token", e);
        }

        // Extract the UID from the FirebaseToken
        String uid = firebaseToken.getUid();

        // Look up the user in your own database using the UID
        User user = userRepository.findByFirebaseUid(uid);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with Firebase UID: " + uid);
        }

        // Create a UserDetails object using Spring Security's User class
        UserDetails userDetails = org.springframework.security.core.userdetails.User.withUsername(user.getEmail())
            .password(user.getPassword())
            .roles(user.getRole())
            .accountExpired(false)
            .accountLocked(false)
            .credentialsExpired(false)
            .disabled(false)
            .build();

        // Create an Authentication object using the UserDetails
        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }

}
