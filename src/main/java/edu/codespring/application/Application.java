package edu.codespring.application;

import edu.codespring.application.user.service.ServiceException;
import edu.codespring.application.user.service.UserService;
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
    void preSpring(){
        try {

//            userService.login("ferko", "asd123");
//            userService.signup("ferko5", "asd123");
            userService.login("ferko5", "asd123");
        } catch (ServiceException e) {
//            System.out.println(e.getMessage());
            log.error(e.getMessage());
            e.printStackTrace();
        }
//        System.out.println("===============================");

        userService.findAll().forEach(msg -> log.info(msg.toString()));
    }

}
