package edu.codespring.sportgh.controller;

import edu.codespring.sportgh.service.FirebaseService;
import edu.codespring.sportgh.service.UserService;
import edu.codespring.sportgh.utils.LoginRequest;
import edu.codespring.sportgh.utils.SignupRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthenticationController {

    private final FirebaseService firebaseService;
    private final UserService userService;

    @PostMapping("/signup")
    public void signup(@RequestBody SignupRequest request) {
        String firebaseUid = firebaseService.parseToken(request.getIdToken());
        userService.signup(request.getEmail(), firebaseUid, request.getPassword());
    }

    @PostMapping("/login")
    public void login(@RequestBody LoginRequest request) {
        String firebaseUid = firebaseService.parseToken(request.getIdToken());
        userService.login(firebaseUid, request.getPassword());
    }

}
