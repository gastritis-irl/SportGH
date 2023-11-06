package edu.codespring.sportgh.service;

import com.google.firebase.auth.*;
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

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;

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
    public boolean userExistsInFirebase(String email) {
        try {
            FirebaseAuth firebaseAuth = FirebaseAuth.getInstance();
            UserRecord userRecord = firebaseAuth.getUserByEmail(email);
            return userRecord != null;
        } catch (FirebaseAuthException e) {
            throw new ServiceException("Failed to check if user exists in firebase", e);
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
            throw new BadRequestException("Failed to verify the Firebase ID token", e);
        }

        // Extract the UID from the FirebaseToken
        String uid = firebaseToken.getUid();
        if (uid == null) {
            throw new BadRequestException("Missing UID from firebase token.");
        }

        // Look up the user in your own database using the UID
        User user = userRepository.findByFirebaseUid(uid);
        if (user == null) {
            throw new BadRequestException("User not found with Firebase UID: " + uid);
        }

        return new UsernamePasswordAuthenticationToken(
                user,
                firebaseToken,
                Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
        );
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
}
