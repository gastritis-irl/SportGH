package edu.codespring.sportgh.security;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import edu.codespring.sportgh.utils.FirebaseAuthenticatedToken;
import edu.codespring.sportgh.utils.FirebaseTokenHolder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;

@Slf4j
public class FirebaseAuthenticationProvider implements AuthenticationProvider {
    @Override
    public Authentication authenticate(Authentication authentication) {
        FirebaseTokenHolder holder = (FirebaseTokenHolder) authentication.getCredentials();
        FirebaseToken decodedToken;
        try {
            decodedToken = FirebaseAuth.getInstance().verifyIdToken(String.valueOf(holder.getToken()));
        } catch (FirebaseAuthException e) {
            log.error("Failed to decode token", e);
            throw new BadCredentialsException("Failed to decode token", e);
        }

        if (decodedToken == null) {
            log.error("Decoded token is null");
            throw new BadCredentialsException("Decoded token is null");
        }

        return new FirebaseAuthenticatedToken(decodedToken.getUid(), decodedToken.getClaims());
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return FirebaseAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
