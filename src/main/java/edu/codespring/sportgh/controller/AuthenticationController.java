package edu.codespring.sportgh.controller;

import edu.codespring.sportgh.service.FirebaseService;
import edu.codespring.sportgh.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthenticationController {

    private final FirebaseService firebaseService;
    private final UserService userService;

    @RequestMapping(method = RequestMethod.POST, path = "/signup")
    public void signup(@RequestParam String username,@RequestParam String idToken, @RequestParam String password) {
        String firebaseUid = firebaseService.parseToken(idToken);
        userService.signup(username, firebaseUid, password);
    }

    @RequestMapping(method = RequestMethod.POST, path = "/login")
    public void login(@RequestParam String idToken, @RequestParam String password) {
        String firebaseUid = firebaseService.parseToken(idToken);
        userService.login(firebaseUid, password);
    }
}
