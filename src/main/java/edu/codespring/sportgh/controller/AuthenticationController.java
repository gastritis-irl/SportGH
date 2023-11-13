package edu.codespring.sportgh.controller;

import edu.codespring.sportgh.security.SecurityUtil;
import edu.codespring.sportgh.service.FirebaseService;
import edu.codespring.sportgh.service.UserService;
import edu.codespring.sportgh.dto.auth.SignupRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthenticationController {

    private final FirebaseService firebaseService;
    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequest request) {
        String firebaseUid = firebaseService.getFirebaseUidFromToken(request.getIdToken());
        userService.signup(request.getEmail(), firebaseUid, SecurityUtil.ROLE_USER);
        String idTokenWithCustomFields = firebaseService.getFirebaseIdTokenWithCustomClaims(request.getIdToken());
        return new ResponseEntity<>(
                idTokenWithCustomFields,
                HttpStatus.OK
        );
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody SignupRequest request) {
        String idTokenWithCustomFields = firebaseService.getFirebaseIdTokenWithCustomClaims(request.getIdToken());
        return new ResponseEntity<>(
                idTokenWithCustomFields,
                HttpStatus.OK
        );
    }
}
