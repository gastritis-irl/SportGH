package edu.codespring.sportgh.service;

import com.google.firebase.auth.FirebaseToken;
import edu.codespring.sportgh.utils.FirebaseTokenHolder;
import org.springframework.security.core.Authentication;

public interface FirebaseService {

    FirebaseToken verifyToken(String idToken);

    FirebaseToken verifyToken(String idToken, boolean checkRevoked);

    FirebaseTokenHolder verifyTokenAndReturnTokenHolder(String idToken);

    FirebaseTokenHolder verifyTokenAndReturnTokenHolder(String idToken, boolean checkRevoked);

    String parseToken(String idToken);

    Authentication getAuthentication(String idToken);
}
