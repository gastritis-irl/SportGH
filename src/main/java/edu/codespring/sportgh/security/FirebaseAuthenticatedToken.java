package edu.codespring.sportgh.security;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

public class FirebaseAuthenticatedToken extends UsernamePasswordAuthenticationToken {

    public FirebaseAuthenticatedToken(Object principal, Object credentials) {
        super(principal, credentials);
    }

}
