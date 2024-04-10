package edu.codespring.sportgh.security;

import edu.codespring.sportgh.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class SecurityUtil {

    public static final String ROLE_USER = "USER";
    public static final String ROLE_ADMIN = "ADMIN";

    public static User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public static boolean isCurrentlyLoggedIn(User user) {
        return Objects.equals(getCurrentUser(), user);
    }

    public static boolean isLoggedIn() {
        try {
            User user = getCurrentUser();
            return user != null;
        } catch (ClassCastException e) {
            return false;
        }
    }

    public static boolean isAdmin() {
        return ROLE_ADMIN.equals(getCurrentUser().getRole());
    }
}
