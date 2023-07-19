package edu.codespring.application;

import edu.codespring.application.service.ServiceException;
import edu.codespring.application.service.UserService;
import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@SpringBootApplication
@RequiredArgsConstructor
@Slf4j
public class Application {

    private final UserService userService;

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @PostConstruct
    void preSpring() {
        try {
            // userService.login("asd", "asd123");
            // userService.signup("user1", "asd123");
            // userService.signup("user2", "asd123");
            // userService.signup("user3", "asd123");
            // userService.signup("user4", "asd123");
             userService.login("asd", "asd123");
        } catch (ServiceException e) {
            log.error(e.getMessage());
        }
        userService.findAll().forEach(msg -> log.info(msg.toString()));
    }

}
