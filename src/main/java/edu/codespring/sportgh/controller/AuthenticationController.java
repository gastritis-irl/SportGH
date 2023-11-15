package edu.codespring.sportgh.controller;

import edu.codespring.sportgh.dto.auth.AuthOutDTO;
import edu.codespring.sportgh.security.SecurityUtil;
import edu.codespring.sportgh.service.FirebaseService;
import edu.codespring.sportgh.service.UserService;
import edu.codespring.sportgh.dto.auth.AuthInDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthenticationController {

    private final FirebaseService firebaseService;
    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<AuthOutDTO> signup(@RequestBody AuthInDTO request) {
        String firebaseUid = firebaseService.getFirebaseUidFromToken(request.getIdToken());
        if (userService.findByFirebaseUid(firebaseUid) != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }

        userService.signup(request.getEmail(), firebaseUid, SecurityUtil.ROLE_USER);
        String idTokenWithCustomFields = firebaseService.getFirebaseIdTokenWithCustomClaims(request.getIdToken());
        return new ResponseEntity<>(new AuthOutDTO(idTokenWithCustomFields), HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthOutDTO> login(@RequestBody AuthInDTO request) {
        String idTokenWithCustomFields = firebaseService.getFirebaseIdTokenWithCustomClaims(request.getIdToken());
        return new ResponseEntity<>(new AuthOutDTO(idTokenWithCustomFields), HttpStatus.OK);
    }
}
