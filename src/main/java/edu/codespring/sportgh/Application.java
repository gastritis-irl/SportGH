package edu.codespring.sportgh;

import edu.codespring.sportgh.service.ServiceException;
import edu.codespring.sportgh.service.UserService;
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
            // add some data to db

            // int nrOfUsers = 30;
            // for (int i = 0; i <= nrOfUsers; i++) {
            //     userService.signup(String.format("user%d", i), "asd123");
            // }

            userService.login("user1", "asd123");
        } catch (ServiceException e) {
            log.error(e.getMessage());
        }
        userService.findAll().forEach(msg -> log.info(msg.toString()));
    }

}
