package edu.codespring.sportgh.security;

// import edu.codespring.sportgh.service.FirebaseService;
// import org.springframework.security.core.Authentication;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.util.StringUtils;
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


    // private final FirebaseService firebaseService;

    @Override
    protected void doFilterInternal(
            @NotNull HttpServletRequest request,
            @NotNull HttpServletResponse response,
            @NotNull FilterChain filterChain
    )
            throws ServletException, IOException {

        // String idToken = request.getHeader("Authorization");
        // idToken = StringUtils.hasText(idToken) ? idToken : null;
        //
        // if (idToken != null) {
        //     Authentication authentication = firebaseService.getAuthentication(idToken);
        //
        //     if (authentication != null) {
        //         SecurityContextHolder.getContext().setAuthentication(authentication);
        //     }
        // }

        filterChain.doFilter(request, response);
    }
}


