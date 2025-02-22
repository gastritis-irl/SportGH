package edu.codespring.sportgh.service;

import com.google.firebase.auth.*;
import com.google.firebase.auth.UserRecord;
import com.google.firebase.auth.UserRecord.UpdateRequest;
import edu.codespring.sportgh.exception.BadRequestException;
import edu.codespring.sportgh.exception.ServiceException;
import edu.codespring.sportgh.model.User;
import edu.codespring.sportgh.repository.UserRepository;
import edu.codespring.sportgh.security.FirebaseTokenHolder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
@RequiredArgsConstructor
public class FirebaseServiceImpl implements FirebaseService {

    private final UserRepository userRepository;

    @Override
    public String signupUserToFirebase(User user, String password) {
        try {
            FirebaseAuth firebaseAuth = FirebaseAuth.getInstance();
            UserRecord userRecord = firebaseAuth.createUser(
                    new UserRecord.CreateRequest()
                            .setEmail(user.getEmail())
                            .setPassword(password)
            );
            return userRecord.getUid();

        } catch (FirebaseAuthException e) {
            throw new ServiceException("Failed to add user " + user.getEmail() + " to firebase", e);
        }
    }

    @Override
    public String getFirebaseUidFromToken(String idToken) {
        FirebaseTokenHolder tokenHolder = verifyTokenAndReturnTokenHolder(idToken);
        return tokenHolder.getUid();
    }

    @Override
    public FirebaseTokenHolder verifyTokenAndReturnTokenHolder(String idToken) {
        try {
            FirebaseToken token = FirebaseAuth.getInstance().verifyIdToken(idToken);
            return new FirebaseTokenHolder(token);
        } catch (FirebaseAuthException e) {
            log.error("Invalid firebase token", e);
            throw new BadRequestException("Invalid firebase token", e);
        }
    }

    @Override
    public Authentication getAuthentication(String idToken) {
        // Verify the ID token using the Firebase SDK
        FirebaseToken firebaseToken;
        try {
            firebaseToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
        } catch (FirebaseAuthException e) {
            log.warn("Failed to verify the Firebase ID token: {}", e.getMessage());
            return null;
        }

        // Extract the UID from the FirebaseToken
        String uid = firebaseToken.getUid();
        if (uid == null) {
            log.warn("Missing UID from firebase token.");
            return null;
        }

        // Look up the user in your own database using the UID
        User user = userRepository.findByFirebaseUid(uid);
        if (user == null) {
            log.warn("User not found with Firebase UID: " + uid);
            return null;
        }

        return new UsernamePasswordAuthenticationToken(
                user,
                firebaseToken,
                Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
        );
    }

    @Override
    public String getFirebaseUid(String email) {
        try {
            FirebaseAuth firebaseAuth = FirebaseAuth.getInstance();
            UserRecord userRecord = firebaseAuth.getUserByEmail(email);
            return userRecord.getUid();
        } catch (FirebaseAuthException e) {
            log.error("Failed to get user with" + email + " from firebase", e);
            return null;
        }
    }

    @Override
    public void syncUserToFirebase(User user) {
        if (user == null || user.getId() == null) {
            throw new ServiceException("User must be saved before calling sync to firebase!");
        }

        String firebaseUid = getFirebaseUid(user.getEmail());
        if (user.getFirebaseUid() == null) {
            if (firebaseUid == null) {
                user.setFirebaseUid(signupUserToFirebase(user, "password"));
                userRepository.save(user);

            } else {
                user.setFirebaseUid(firebaseUid);
                userRepository.save(user);
            }
        } else {
            if (!user.getFirebaseUid().equals(firebaseUid)) {
                // invalid data --> update the firebaseId in our local user
                user.setFirebaseUid(firebaseUid);
                userRepository.save(user);
            } // else do nothing, because everything is good
        }
    }

    @Override
    public Collection<User> getUsers() {
        Collection<User> users = new ArrayList<>();
        try {
            ListUsersPage listUsersPage = FirebaseAuth.getInstance().listUsers(null);
            for (ExportedUserRecord i : listUsersPage.getValues()) {
                users.add(new User(
                        i.getEmail(),
                        i.getEmail(),
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        i.getUid(),
                        "USER",
                        null,
                        null,
                        null
                ));
            }
        } catch (FirebaseAuthException e) {
            throw new ServiceException("[FbService] listUsers failed!", e);
        }
        return users;
    }

    @Override
    public String getFirebaseIdTokenWithCustomClaims(String idToken) {
        try {
            FirebaseAuth firebaseAuth = FirebaseAuth.getInstance();
            FirebaseToken decodedToken = firebaseAuth.verifyIdToken(idToken);
            String uid = decodedToken.getUid();
            User user = userRepository.findByFirebaseUid(uid);

            Map<String, Object> customClaimsMap = new ConcurrentHashMap<>();
            customClaimsMap.put("role", user.getRole());
            customClaimsMap.put("userId", user.getId());

            UpdateRequest updateRequest = new UpdateRequest(uid).setCustomClaims(customClaimsMap);
            firebaseAuth.updateUser(updateRequest);

            return firebaseAuth.createCustomToken(uid);
        } catch (FirebaseAuthException e) {
            throw new ServiceException("Error adding custom claims to firebase id token.", e);
        }
    }
}
