package edu.codespring.sportgh.controller;

import edu.codespring.sportgh.dto.auth.AuthOutDTO;
import edu.codespring.sportgh.exception.ServiceException;
import edu.codespring.sportgh.model.User;
import edu.codespring.sportgh.security.SecurityUtil;
import edu.codespring.sportgh.service.FirebaseService;
import edu.codespring.sportgh.service.UserService;
import edu.codespring.sportgh.dto.auth.AuthInDTO;
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
    public ResponseEntity<AuthOutDTO> signup(@RequestBody AuthInDTO request) {
        String firebaseUid = firebaseService.getFirebaseUidFromToken(request.getIdToken());

        User user = userService.findByFirebaseUid(firebaseUid);
        if (user == null) {
            userService.signup(request.getEmail(), firebaseUid, SecurityUtil.ROLE_USER);
        } else {
            String firebaseUidOfUsersEmail = firebaseService.getFirebaseUid(user.getEmail());
            if (!firebaseUid.equals(firebaseUidOfUsersEmail)) {
                log.warn("User inconsistency for fUid {}, local DB email is {}, firebaseUid for this email is {}",
                        firebaseUid, user.getEmail(), firebaseUidOfUsersEmail);
                throw new ServiceException("User signup failed, please contact your system administrator!");
            }
        }

        String idTokenWithCustomFields = firebaseService.getFirebaseIdTokenWithCustomClaims(request.getIdToken());
        return new ResponseEntity<>(new AuthOutDTO(idTokenWithCustomFields), HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthOutDTO> login(@RequestBody AuthInDTO request) {
        String idTokenWithCustomFields = firebaseService.getFirebaseIdTokenWithCustomClaims(request.getIdToken());
        return new ResponseEntity<>(new AuthOutDTO(idTokenWithCustomFields), HttpStatus.OK);
    }
}
