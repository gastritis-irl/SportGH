package edu.codespring.sportgh.controller;

import edu.codespring.sportgh.service.FirebaseService;
import edu.codespring.sportgh.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthenticationController {

    private final FirebaseService firebaseService;
    private final UserService userService;

    @PostMapping("/signup")
    public void signup(@RequestParam String email, @RequestParam String idToken, @RequestParam String password) {
        String firebaseUid = firebaseService.parseToken(idToken);
        userService.signup(email, firebaseUid, password);
    }

    @PostMapping("/login")
    public void login(@RequestParam String idToken, @RequestParam String password) {
        String firebaseUid = firebaseService.parseToken(idToken);
        userService.login(firebaseUid, password);
    }
}
