package edu.codespring.sportgh.controller;

import edu.codespring.sportgh.dto.auth.SignRequestOut;
import edu.codespring.sportgh.security.SecurityUtil;
import edu.codespring.sportgh.service.FirebaseService;
import edu.codespring.sportgh.service.UserService;
import edu.codespring.sportgh.dto.auth.SignupRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthenticationController {

    private final FirebaseService firebaseService;
    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<SignRequestOut> signup(@RequestBody SignupRequest request) {
        String firebaseUid = firebaseService.getFirebaseUidFromToken(request.getIdToken());
        userService.signup(request.getEmail(), firebaseUid, SecurityUtil.ROLE_USER);
        String idTokenWithCustomFields = firebaseService.getFirebaseIdTokenWithCustomClaims(request.getIdToken());
        return new ResponseEntity<>(
                new SignRequestOut(idTokenWithCustomFields),
                HttpStatus.OK
        );
    }

    @PostMapping("/login")
    public ResponseEntity<SignRequestOut> login(@RequestBody SignupRequest request) {
        String idTokenWithCustomFields = firebaseService.getFirebaseIdTokenWithCustomClaims(request.getIdToken());
        return new ResponseEntity<>(
                new SignRequestOut(idTokenWithCustomFields),
                HttpStatus.OK
        );
    }
}
