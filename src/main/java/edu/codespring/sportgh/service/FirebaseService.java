package edu.codespring.sportgh.service;

import edu.codespring.sportgh.model.User;
import edu.codespring.sportgh.security.FirebaseTokenHolder;
import org.springframework.security.core.Authentication;

import java.util.Collection;

public interface FirebaseService {

    String signupUserToFirebase(User user, String password);

    FirebaseTokenHolder verifyTokenAndReturnTokenHolder(String idToken);

    String getFirebaseUidFromToken(String idToken);

    Authentication getAuthentication(String idToken);

    Collection<User> getUsers();

    void syncUserToFirebase(User localUser);

    String getFirebaseUid(String email);

    String getFirebaseIdTokenWithCustomClaims(String idToken);
}
