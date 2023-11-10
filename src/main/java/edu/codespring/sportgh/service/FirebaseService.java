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

    boolean userExistsInFirebase(String email);

    void syncUserToFirebase(User localUser, Collection<User> firebaseUsers);

    User findFirebaseUserByEmail(Collection<User> firebaseUsers, String email);
}
