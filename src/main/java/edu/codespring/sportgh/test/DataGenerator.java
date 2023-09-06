package edu.codespring.sportgh.test;

import edu.codespring.sportgh.exception.ServiceException;
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
            initUsers();
            log.info("Generating users: OK");
        } catch (ServiceException e) {
            log.warn("Generating users: FAILED");
            log.warn(e.getMessage());
        }

        initCategories();
        log.info("Generating categories: OK");

        initSubCategories();
        log.info("Generating subcategories: OK");

        initProducts();
        log.info("Generating products: OK");
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
        saveCategory(
            "Water sports",
            "...",
            "https://img.freepik.com/premium-vector/rafling-water-sport-cartoon_18591-19936.jpg?"
                + "w=2000"
        );
        saveCategory(
            "Combat sports",
            "...",
            "https://media.istockphoto.com/id/1142510634/vector/two-sport-karate-man-character"
                + "s-fight-sport-training-concept-vector-flat-cartoon-graphic.jpg?"
                + "s=170667a&w=0&k=20&c=mgj8QGQairRtGwnBUcJWcGwNyBwq-FIWCTWMyNJxBnc="
        );
        saveCategory(
            "Extreme sports",
            "...",
            "https://graphicriver.img.customer.envatousercontent.com/files/350625383/preview.jpg?"
                + "auto=compress%2Cformat&fit=crop&crop=top&w=590&h=590&s=8333982ebd8d4088c241978b83ca98c4"
        );
        saveCategory(
            "Team sports",
            "...",
            "https://img.freepik.com/premium-vector/soccer-players-team-groupt-cartoon-"
                + "illustration_9026-23.jpg?w=2000"
        );
        saveCategory(
            "Winter sports",
            "...",
            "https://encrypted-tbn0.gstatic.com/images?"
                + "q=tbn:ANd9GcQZTKlVUnqUD-Z_GERKB7NtyH_2wpBHt_ZH2Q&usqp=CAU"
        );
        saveCategory(
            "Track & Field",
            "...",
            "https://static.vecteezy.com/system/resources/previews/002/471/108/original/"
                + "running-young-men-sport-in-the-race-track-free-vector.jpg"
        );
        saveCategory(
            "Other",
            "Other sports",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3TN373IJFyFN4sjMCItC"
                + "ugy7f1P9RqVdX4gRkApSZSgRLpUYCIcFfcUS5YCZEkL-JUBE&usqp=CAU"
        );
    }

    public void initSubCategories() {
        saveSubcategory(
            "Swimming",
            "Water sports"
        );
        saveSubcategory(
            "Surfing",
            "Water sports"
        );
        saveSubcategory(
            "Boxing",
            "Combat sports"
        );
        saveSubcategory(
            "Judo",
            "Combat sports"
        );
        saveSubcategory(
            "Rock Climbing",
            "Extreme sports"
        );
        saveSubcategory(
            "Skydiving",
            "Extreme sports"
        );
        saveSubcategory(
            "Soccer (football)",
            "Team sports"
        );
        saveSubcategory(
            "Basketball",
            "Team sports"
        );
        saveSubcategory(
            "Skiing",
            "Winter sports"
        );
        saveSubcategory(
            "Ice Hockey",
            "Winter sports"
        );
        saveSubcategory(
            "Running",
            "Track & Field"
        );
        saveSubcategory(
            "Cycling",
            "Track & Field"
        );
    }

    public void initProducts() {
        User user = userService.findByUsername("akos@test.com");
        if (user == null) {
            throw new ServiceException("User doesn't exist.");
        }

        saveProduct(
            new Product(
                true,
                "Swimming googles",
                "Googles for swimming",
                "Cluj-Napoca, Romania",
                20.0,
                null,
                null
            ),
            "Swimming",
            user
        );
        saveProduct(
            new Product(
                true,
                "Flip flops",
                "Flip flops for easier swimming",
                "Cluj-Napoca, Romania",
                35.0,
                null,
                null
            ),
            "Swimming",
            user
        );
        saveProduct(
            new Product(
                true,
                "Bike",
                "Bike for cycling",
                "Cluj-Napoca, Romania",
                100.0,
                null,
                null
            ),
            "Cycling",
            user
        );
        saveProduct(
            new Product(
                true,
                "Helmet",
                "Helmet for your protection",
                "Cluj-Napoca, Romania",
                18.0,
                null,
                null
            ),
            "Cycling",
            user

        );
        saveProduct(
            new Product(
                true,
                "Flashlight",
                "Flashlight for better visibility",
                "Cluj-Napoca, Romania",
                15.0,
                null,
                null
            ),
            "Cycling",
            user

        );
        saveProduct(
            new Product(
                true,
                "Bicycle lock",
                "Bicycle lock for your bike's protection",
                "Cluj-Napoca, Romania",
                20.0,
                null,
                null
            ),
            "Cycling",
            user
        );
    }

    public void saveCategory(String name, String description, String imageURL) {
        if (!categoryService.existsByName(name)) {
            categoryService.save(new Category(
                name,
                description,
                imageURL,
                null
            ));
        }
    }

    public void saveSubcategory(String name, String categoryName) {
        Category category = categoryService.findByName(categoryName);
        if (category != null && !subCategoryService.existsByName(name)) {
            subCategoryService.save(new SubCategory(
                name,
                category,
                null
            ));
        }
    }

    public void saveProduct(Product product, String subCategoryName, User user) {
        SubCategory subCategory = subCategoryService.findByName(subCategoryName);
        if (subCategory != null && productService.notExistsByNameAndUser(product.getName(), user)) {
            productService.save(new Product(
                true,
                product.getName(),
                product.getDescription(),
                product.getLocation(),
                product.getRentPrice(),
                subCategory,
                user
            ));
        }
    }
}
