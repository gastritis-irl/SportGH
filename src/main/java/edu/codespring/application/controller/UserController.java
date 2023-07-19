package edu.codespring.application.controller;

import edu.codespring.application.dto.UserInDTO;
import edu.codespring.application.dto.UserOutDTO;
import edu.codespring.application.mapper.UserMapper;
import edu.codespring.application.model.User;
import edu.codespring.application.service.UserService;
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

    @RequestMapping(method = RequestMethod.GET)
    public Collection<UserOutDTO> findAllUsers() {
        Collection<User> users = userService.findAll();
        return userMapper.usersToOuts(users);
    }

    @RequestMapping(method = RequestMethod.GET, path = "/{userId}")
    public UserOutDTO findById(@PathVariable Long userId) {
        User user = userService.findById(userId);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        return userMapper.userToOut(user);
    }

    @RequestMapping(method = RequestMethod.DELETE, path = "/{userId}")
    public void deleteById(@PathVariable Long userId) {
        userService.deleteById(userId);
    }

    @RequestMapping(method = RequestMethod.POST)
    public UserOutDTO createUser(@RequestBody @Valid UserInDTO userInDTO) {
        User user = userService.signup(userInDTO.getUserName(), userInDTO.getPassword());
        return userMapper.userToOut(user);
    }
}
