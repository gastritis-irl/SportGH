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
import org.springframework.beans.factory.annotation.Value;
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
    private final ImageService imageService;

    @Value("${test.file.storage.location}")
    private String testFileStorageLocation;

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
                "Water sports are sports which are played in water.",
                testFileStorageLocation + "/waterSports.png"

        );
        saveCategory(
                "Combat sports",
                "Combat sports, or fighting sports, are competitive sports " +
                        "in which two people engage in combat.",
                testFileStorageLocation + "/combatSports.png"

        );
        saveCategory(
                "Extreme sports",
                "Extreme sports are recreational " +
                        "activities perceived as involving a high degree of risk.",
                testFileStorageLocation + "/extremeSports.png"

        );
        saveCategory(
                "Team sports",
                "Team sports are sports played by teams with some " +
                        "members not participating directly with the opponents.    ",
                testFileStorageLocation + "/teamSports.png"

        );
        saveCategory(
                "Winter sports",
                "Winter sports or winter activities are competitive sports or " +
                        "non-competitive recreational activities which are played on snow or ice.",
                testFileStorageLocation + "/winterSports.png"

        );
        saveCategory(
                "Track & Field",
                "Track and field is a sport which includes athletic contests established " +
                        "on the skills of running, jumping, and throwing.",
                testFileStorageLocation + "/trackAndField.png"

        );
        saveCategory(
                "Other",
                "Other sports",
                testFileStorageLocation + "/otherSports.png"

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
                        "Swimming goggles",
                        "Goggles for swimming",
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

    public void saveCategory(String name, String description, String imageUrl) {
        DummyDataGenerator.save(name, description, imageUrl, categoryService, imageService);
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
        if (subCategory != null && !productService.existsByNameAndUser(product.getName(), user)) {
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
