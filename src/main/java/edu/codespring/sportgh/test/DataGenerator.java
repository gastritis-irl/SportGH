package edu.codespring.sportgh.test;

import edu.codespring.sportgh.model.Category;
import edu.codespring.sportgh.model.Product;
import edu.codespring.sportgh.model.SubCategory;
import edu.codespring.sportgh.model.User;
import edu.codespring.sportgh.service.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.Collection;


@Profile("data-gen")
@Slf4j
@RequiredArgsConstructor
@Component
public class DataGenerator {

    private final UserService userService;
    private final CategoryService categoryService;
    private final SubCategoryService subCategoryService;
    private final ProductService productService;
    private final FirebaseService firebaseService;

    @PostConstruct
    public void init() {
        try {
            log.info("Generating users...");
            initUsers();
            log.info("Generating users: OK");
        } catch (ServiceException e) {
            log.warn("Generating users: FAILED");
            log.warn(e.getMessage());
        }

        try {
            log.info("Generating categories...");
            initCategories();
            log.info("Generating categories: OK");
        } catch (ServiceException e) {
            log.warn("Generating categories: FAILED");
            log.warn(e.getMessage());
        }

        try {
            log.info("Generating subcategories...");
            initSubCategories();
            log.info("Generating subcategories: OK");
        } catch (ServiceException e) {
            log.warn("Generating subcategories: FAILED");
            log.warn(e.getMessage());
        }

        try {
            log.info("Generating products...");
            initProducts();
            log.info("Generating products: OK");
        } catch (ServiceException e) {
            log.warn("Generating products: FAILED");
            log.warn(e.getMessage());
        }
    }

    public void initUsers() {
        Collection<User> userList = firebaseService.getUsers();
        log.info("Users: {}", userList);
        for (User user : userList) {
            if (userService.findByFirebaseUid(user.getFirebaseUid()) == null) {
                userService.signup(user.getEmail(), user.getFirebaseUid(), user.getPassword());
            }
        }
    }

    public void initCategories() {
        if (!categoryService.existsByName("Water sports")) {
            categoryService.save(new Category(
                    "Water sports",
                    "...",
                    "https://img.freepik.com/premium-vector/rafling-water-sport-cartoon_18591-19936.jpg?"
                            + "w=2000",
                    null)
            );
        }
        if (!categoryService.existsByName("Combat sports")) {
            categoryService.save(new Category(
                    "Combat sports",
                    "...",
                    "https://media.istockphoto.com/id/1142510634/vector/two-sport-karate-man-character"
                            + "s-fight-sport-training-concept-vector-flat-cartoon-graphic.jpg?"
                            + "s=170667a&w=0&k=20&c=mgj8QGQairRtGwnBUcJWcGwNyBwq-FIWCTWMyNJxBnc=",
                    null)
            );
        }
        if (!categoryService.existsByName("Extreme sports")) {
            categoryService.save(new Category(
                    "Extreme sports",
                    "...",
                    "https://graphicriver.img.customer.envatousercontent.com/files/350625383/preview.jpg?"
                            + "auto=compress%2Cformat&fit=crop&crop=top&w=590&h=590&s=8333982ebd8d4088c241978b83ca98c4",
                    null)
            );
        }
        if (!categoryService.existsByName("Team sports")) {
            categoryService.save(new Category(
                    "Team sports",
                    "...",
                    "https://img.freepik.com/premium-vector/soccer-players-team-groupt-cartoon-"
                            + "illustration_9026-23.jpg?w=2000",
                    null)
            );
        }
        if (!categoryService.existsByName("Winter sports")) {
            categoryService.save(new Category(
                    "Winter sports",
                    "...",
                    "https://encrypted-tbn0.gstatic.com/images?"
                            + "q=tbn:ANd9GcQZTKlVUnqUD-Z_GERKB7NtyH_2wpBHt_ZH2Q&usqp=CAU",
                    null)
            );
        }
        if (!categoryService.existsByName("Track & Field")) {
            categoryService.save(new Category(
                    "Track & Field",
                    "...",
                    "https://static.vecteezy.com/system/resources/previews/002/471/108/original/"
                            + "running-young-men-sport-in-the-race-track-free-vector.jpg",
                    null)
            );
        }
        if (!categoryService.existsByName("Other")) {
            categoryService.save(new Category(
                    "Other",
                    "Other sports",
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3TN373IJFyFN4sjMCItC"
                            + "ugy7f1P9RqVdX4gRkApSZSgRLpUYCIcFfcUS5YCZEkL-JUBE&usqp=CAU",
                    null)
            );
        }
    }

    public void initSubCategories() {
    }

    public void initProducts() {
    }
}
