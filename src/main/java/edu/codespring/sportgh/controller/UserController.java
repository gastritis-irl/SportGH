package edu.codespring.sportgh.controller;

import edu.codespring.sportgh.dto.UserOutDTO;
import edu.codespring.sportgh.mapper.UserMapper;
import edu.codespring.sportgh.model.User;
import edu.codespring.sportgh.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collection;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    @Secured({"ROLE_ADMIN"})
    @GetMapping
    public ResponseEntity<Collection<UserOutDTO>> findAll() {
        Collection<User> users = userService.findAll();
        return new ResponseEntity<>(userMapper.usersToOuts(users), HttpStatus.OK);
    }

    @Secured({"ROLE_USER", "ROLE_ADMIN"})
    @GetMapping(path = "/{userId}")
    public ResponseEntity<UserOutDTO> findById(
        @PathVariable Long userId
    ) {
        User user = userService.findById(userId);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(userMapper.userToOut(user), HttpStatus.OK);
    }

    @Secured({"ROLE_ADMIN"})
    @DeleteMapping(path = "/{userId}")
    public ResponseEntity<?> deleteById(
        @PathVariable Long userId
    ) {
        userService.deleteById(userId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
