package edu.codespring.sportgh;

import edu.codespring.sportgh.repository.CategoryRepository;
import edu.codespring.sportgh.service.CategoryService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@RequiredArgsConstructor
@Slf4j
public class SportGH {

    private final CategoryService categoryService;

    public static void main(String[] args) {
        SpringApplication.run(SportGH.class, args);
    }

    // @PostConstruct
    // void preSpring(){
    //     // categoryService.createCategory("Football", "Football is a family of team sports that involve, to varying degrees, kicking a ball to score a goal. Unqualified, the word football normally means the form of football that is the most popular where the word is used.", "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Flag_of_Ghana.svg/1200px-Flag_of_Ghana.svg.png");
    //     // categoryService.createCategory("Basketball", "Basketball is a team sport in which two teams, most commonly of five players each, opposing one another on a rectangular court, compete with the primary objective of shooting a basketball through the defender's hoop while preventing the opposing team from shooting through their own hoop.", "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Flag_of_Ghana.svg/1200px-Flag_of_Ghana.svg.png");
    // }
}
