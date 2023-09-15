package edu.codespring.sportgh.controller;

import edu.codespring.sportgh.dto.UserInDTO;
import edu.codespring.sportgh.dto.UserOutDTO;
import edu.codespring.sportgh.mapper.UserMapper;
import edu.codespring.sportgh.model.User;
import edu.codespring.sportgh.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
@Slf4j
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    @GetMapping
    public ResponseEntity<UserOutDTO> findByUsername(
            @RequestParam("username") Optional<String> username,
            @RequestParam("userId") Optional<Long> userId
    ) {

        if (username.isPresent() && userId.isPresent() || username.isEmpty() && userId.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        } else {
            User user;

            if (username.isPresent()) {
                user = userService.findByUsername(username.get());
            } else {
                user = userService.findById(userId.get());
            }

            if (user == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND);
            }

            return new ResponseEntity<>(userMapper.userToOut(user), HttpStatus.OK);
        }
    }

    @DeleteMapping(path = "/{userId}")
    public ResponseEntity<?> deleteById(@PathVariable Long userId) {
        userService.deleteById(userId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping(path = "/{userId}")
    public ResponseEntity<UserOutDTO> update(
            @Valid @RequestBody UserInDTO userInDTO,
            @PathVariable Long userId
    ) {

        userInDTO.setId(userId);
        log.info("User with ID {} updated successfully.", userInDTO.getId());
        log.info("User details: {}", userInDTO);

        User user = userMapper.dtoToUser(userInDTO);
        User updatedUser = userService.update(user);
        return new ResponseEntity<>(userMapper.userToOut(updatedUser), HttpStatus.OK);
    }

    @DeleteMapping
    public ResponseEntity<?> deleteAll() {
        userService.deleteAll();
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
