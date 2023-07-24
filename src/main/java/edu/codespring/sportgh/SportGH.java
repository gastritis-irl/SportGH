package edu.codespring.sportgh;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@SpringBootApplication
@RequiredArgsConstructor
@Slf4j
public class SportGH {
    public static void main(String[] args) {
        SpringApplication.run(SportGH.class, args);
    }

}
