package edu.codespring.sportgh.security;

import edu.codespring.sportgh.utils.FirebaseTokenHolder;
import org.springframework.security.authentication.AbstractAuthenticationToken;

public class FirebaseAuthenticationToken extends AbstractAuthenticationToken {

    private final FirebaseTokenHolder tokenHolder;

    public FirebaseAuthenticationToken(FirebaseTokenHolder tokenHolder) {
        super(null);
        this.tokenHolder = tokenHolder;
        setAuthenticated(true);
    }

    @Override
    public Object getCredentials() {
        return tokenHolder;
    }

    @Override
    public Object getPrincipal() {
        return tokenHolder;
    }
}
