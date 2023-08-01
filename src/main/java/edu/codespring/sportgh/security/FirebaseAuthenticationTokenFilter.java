package edu.codespring.sportgh.security;

import com.google.firebase.auth.FirebaseToken;
import edu.codespring.sportgh.service.FirebaseService;
import edu.codespring.sportgh.utils.FirebaseTokenHolder;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class FirebaseAuthenticationTokenFilter extends OncePerRequestFilter {

    private final FirebaseService firebaseService;

    public FirebaseAuthenticationTokenFilter(FirebaseService firebaseService) {
        super();
        this.firebaseService = firebaseService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
        throws ServletException, IOException {

        final String authToken = request.getHeader("X-Authorization-Firebase");

        if (authToken != null) {
            FirebaseToken firebaseToken = firebaseService.verifyToken(authToken);
            FirebaseAuthenticationToken authentication = new FirebaseAuthenticationToken(
                new FirebaseTokenHolder(firebaseToken));
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }

}

