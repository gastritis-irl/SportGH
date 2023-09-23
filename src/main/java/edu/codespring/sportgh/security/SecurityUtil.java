package edu.codespring.sportgh.security;

import edu.codespring.sportgh.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SecurityUtil {

    public static final String ROLE_USER = "USER";
    public static final String ROLE_ADMIN = "ADMIN";

    public boolean isCurrentlyLoggedIn(User user) {
        return SecurityContextHolder.getContext().getAuthentication().getPrincipal().equals(user);
    }

    public boolean isLoggedIn() {
        try {
            User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            return user != null;
        } catch (ClassCastException e) {
            return false;
        }
    }
}
