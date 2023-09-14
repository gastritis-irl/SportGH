package edu.codespring.sportgh.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@RequiredArgsConstructor
@Component
public class FirebaseAuthenticationTokenFilter extends OncePerRequestFilter {

    /*
    private final FirebaseService firebaseService;
    */
    @Override
    protected void doFilterInternal(
        @NotNull HttpServletRequest request,
        @NotNull HttpServletResponse response,
        @NotNull FilterChain filterChain
    )
        throws ServletException, IOException {
        /*
        String idToken = extractToken(request);

        if (idToken != null) {
            Authentication authentication = firebaseService.getAuthentication(idToken);

            if (authentication != null) {
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
         */

        filterChain.doFilter(request, response);
    }

    /*
    private String extractToken(HttpServletRequest request) {
        String idToken = request.getHeader("Authorization");
        if (StringUtils.hasText(idToken)) {
            return idToken;
        }
        return null;
    }
    */
}


