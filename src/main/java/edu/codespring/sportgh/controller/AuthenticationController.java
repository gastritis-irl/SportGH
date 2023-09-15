package edu.codespring.sportgh.controller;

import edu.codespring.sportgh.model.User;
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
    public ResponseEntity<User> signup(@RequestBody SignupRequest request) {
        String firebaseUid = firebaseService.getFirebaseUidFromToken(request.getIdToken());
        return new ResponseEntity<>(
            userService.signup(request.getEmail(), firebaseUid),
            HttpStatus.OK
        );
    }
}
