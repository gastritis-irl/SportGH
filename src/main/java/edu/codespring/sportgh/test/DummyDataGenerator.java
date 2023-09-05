package edu.codespring.sportgh.test;

import edu.codespring.sportgh.exception.ServiceException;
import edu.codespring.sportgh.model.*;
import edu.codespring.sportgh.service.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.Collection;


@Profile("dummy-data-gen")
@Slf4j
@RequiredArgsConstructor
@Component
public class DummyDataGenerator {

    private final UserService userService;
    private final CategoryService categoryService;
    private final SubCategoryService subCategoryService;
    private final ProductService productService;
    private final FirebaseService firebaseService;
    private final ImageService imageService;

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
        log.info("Generating dummy categories: OK");

        initSubCategories();
        log.info("Generating dummy subcategories: OK");

        initProducts();
        log.info("Generating dummy products: OK");
    }

    public void initUsers() {
        Collection<User> userList = firebaseService.getUsers();
        log.info("Users: {}", userList);
        for (User user : userList) {
            if (userService.findByFirebaseUid(user.getFirebaseUid()) == null
                && userService.findByUsername(user.getEmail()) == null) {
                userService.signup(user.getEmail(), user.getFirebaseUid(), user.getPassword());
            }
        }
    }

    public void initCategories() {
        saveCategory(
            "DummyCategory",
            "",
            ""
        );
    }

    public void initSubCategories() {
        saveSubcategory(
            "DummySubcategory",
            "DummyCategory"
        );
    }

    public void initProducts() {
        User user = userService.findByUsername("akos@test.com");
        if (user == null) {
            throw new ServiceException("User doesn't exist.");
        }

        for (int i = 1; i <= 300; i++) {
            saveProduct(
                new Product(
                    true,
                    String.format("Product%d", i),
                    "",
                    "",
                    10.0 + i,
                    null,
                    null
                ),
                "DummySubcategory",
                user
            );
        }
    }

    public void saveCategory(String name, String description, String imageUrl) {
        save(name, description, imageUrl, categoryService, imageService);
    }

    static void save(String name, String description, String imageUrl,
                     CategoryService categoryService, ImageService imageService) {
        if (!categoryService.existsByName(name)) {
            // Extract the image name from the URL
            String imageName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);

            // Extract the URL without the image name
            String urlWithoutImageName = imageUrl.substring(0, imageUrl.lastIndexOf('/'));

            // Create a new Image instance with the given name and URL
            Image image = new Image(imageName, urlWithoutImageName);

            // Create a new Category instance and associate it with the Image
            Category category = new Category(
                name,
                description,
                image
            );

            // Save the category with the associated image
            categoryService.save(category);

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
