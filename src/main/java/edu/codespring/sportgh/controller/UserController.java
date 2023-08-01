package edu.codespring.sportgh.controller;

import edu.codespring.sportgh.dto.UserInDTO;
import edu.codespring.sportgh.dto.UserOutDTO;
import edu.codespring.sportgh.mapper.UserMapper;
import edu.codespring.sportgh.model.User;
import edu.codespring.sportgh.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collection;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    @GetMapping
    public Collection<UserOutDTO> findAll() {
        Collection<User> users = userService.findAll();
        return userMapper.usersToOuts(users);
    }

    @GetMapping(path = "/{userId}")
    public UserOutDTO findById(@PathVariable Long userId) {
        User user = userService.findById(userId);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        return userMapper.userToOut(user);
    }

    @DeleteMapping(path = "/{userId}")
    public void deleteById(@PathVariable Long userId) {
        userService.deleteById(userId);
    }

    @PostMapping
    public UserOutDTO save(@RequestBody @Valid UserInDTO userInDTO) {
        User user = userService.signup(userInDTO.getName(), userInDTO.getPassword());
        return userMapper.userToOut(user);
    }

    @DeleteMapping
    public void deleteAll() {
        userService.deleteAll();
    }
}
