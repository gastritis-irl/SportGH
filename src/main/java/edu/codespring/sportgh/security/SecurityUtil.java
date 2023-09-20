package edu.codespring.sportgh.security;

import edu.codespring.sportgh.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SecurityUtil {

    public boolean isCurrentlyLoggedIn(User user) {
        return SecurityContextHolder.getContext().getAuthentication().getPrincipal().equals(user);
    }
}
