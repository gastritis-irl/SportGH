package edu.codespring.sportgh.test;

import edu.codespring.sportgh.exception.ServiceException;
import edu.codespring.sportgh.model.*;
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

    @Value("${file.storage.location}")
    private String fileStorageLocation;

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
            fileStorageLocation + "/testImages/waterSports.png"

        );
        saveCategory(
            "Combat sports",
            "...",
            fileStorageLocation + "/testImages/combatSports.png"

        );
        saveCategory(
            "Extreme sports",
            "...",
            fileStorageLocation + "/testImages/extremeSports.png"

        );
        saveCategory(
            "Team sports",
            "...",
            fileStorageLocation + "/testImages/teamSports.png"

        );
        saveCategory(
            "Winter sports",
            "...",
            fileStorageLocation + "/testImages/winterSports.png"

        );
        saveCategory(
            "Track & Field",
            "...",
            fileStorageLocation + "/testImages/trackAndField.png"

        );
        saveCategory(
            "Other",
            "Other sports",
            fileStorageLocation + "/testImages/otherSports.png"

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
            "Swimming googles",
            "Googles for swimming",
            20.0,
            "Swimming",
            user
        );
        saveProduct(
            "Flip flops",
            "Flip flops for easier swimming",
            35.0,
            "Swimming",
            user
        );
        saveProduct(
            "Bike",
            "Bike for cycling",
            100.0,
            "Cycling",
            user
        );
        saveProduct(
            "Helmet",
            "Helmet for your protection",
            18.0,
            "Cycling",
            user

        );
        saveProduct(
            "Flashlight",
            "Flashlight for better visibility",
            15.0,
            "Cycling",
            user

        );
        saveProduct(
            "Bicycle lock",
            "Bicycle lock for your bike's protection",
            20.0,
            "Cycling",
            user
        );
    }

    public void saveCategory(String name, String description, String imageUrl) {
        if (!categoryService.existsByName(name)) {
            // Extract the image name from the URL
            String imageName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);

            // Create a new Image instance with the given name and URL
            Image image = new Image(imageName, imageUrl, null);

            // Create a new Category instance and associate it with the Image
            Category category = new Category(
                name,
                description,
                null,
                image
            );

            // Save the category with the associated image
            categoryService.save(category);

            // Now that the category is saved, it should have an ID generated by the database
            // Set this ID in the image and update it
            image.setCategory(category);

            // Depending on your JPA settings, you might need to explicitly save the image again
            imageService.saveData(image);  // Uncomment if needed
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

    public void saveProduct(String name, String description, Double rentPrice, String subCategoryName, User user) {
        SubCategory subCategory = subCategoryService.findByName(subCategoryName);
        if (subCategory != null && !productService.existsByNameAndUser(name, user)) {
            productService.save(new Product(
                true,
                name,
                description,
                rentPrice,
                subCategory,
                user
            ));
        }
    }
}
