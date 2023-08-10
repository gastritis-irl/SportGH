package edu.codespring.sportgh.service;

import edu.codespring.sportgh.security.FirebaseTokenHolder;
import org.springframework.security.core.Authentication;

public interface FirebaseService {

    FirebaseTokenHolder verifyTokenAndReturnTokenHolder(String idToken);

    String getFirebaseUidFromToken(String idToken);

    Authentication getAuthentication(String idToken);
}
