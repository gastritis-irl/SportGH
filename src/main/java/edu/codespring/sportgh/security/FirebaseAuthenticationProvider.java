package edu.codespring.sportgh.security;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import edu.codespring.sportgh.utils.FirebaseAuthenticatedToken;
import edu.codespring.sportgh.utils.FirebaseTokenHolder;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.authentication.BadCredentialsException;

public class FirebaseAuthenticationProvider implements AuthenticationProvider {
    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        FirebaseTokenHolder holder = (FirebaseTokenHolder) authentication.getCredentials();
        FirebaseToken decodedToken;
        try {
            decodedToken = FirebaseAuth.getInstance().verifyIdToken(holder.getToken());
        } catch (Exception e) {
            throw new BadCredentialsException("Failed to decode token", e);
        }

        if (decodedToken == null) {
            throw new BadCredentialsException("Decoded token is null");
        }

        return new FirebaseAuthenticatedToken(decodedToken.getUid(), decodedToken.getClaims());
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return (FirebaseAuthenticationToken.class.isAssignableFrom(authentication));
    }
}
