package edu.codespring.sportgh.controller;

import edu.codespring.sportgh.dto.UserOutDTO;
import edu.codespring.sportgh.mapper.UserMapper;
import edu.codespring.sportgh.model.User;
import edu.codespring.sportgh.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    @GetMapping
    public ResponseEntity<UserOutDTO> findByUsername(@RequestParam("username") Optional<String> username,
                                                     @RequestParam Optional<Long> userId) {
        validateRequestParams(username, userId);

        User user = fetchUserByUsernameOrId(username, userId);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(userMapper.userToOut(user), HttpStatus.OK);
    }

    private void validateRequestParams(Optional<String> username, Optional<Long> userId) {
        if (username.isPresent() && userId.isPresent() || username.isEmpty() && userId.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
    }

    private User fetchUserByUsernameOrId(Optional<String> username, Optional<Long> userId) {
        if (username.isPresent()) {
            return userService.findByUsername(username.get());
        } else {
            return userService.findById(userId.get());
        }
    }


    @DeleteMapping(path = "/{userId}")
    public ResponseEntity<?> deleteById(@PathVariable Long userId) {
        userService.deleteById(userId);
        return new ResponseEntity<>(HttpStatus.OK);
    }


    @DeleteMapping
    public ResponseEntity<?> deleteAll() {
        userService.deleteAll();
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
