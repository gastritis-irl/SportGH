package edu.codespring.sportgh.test;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.codespring.sportgh.exception.ServiceException;
import edu.codespring.sportgh.model.*;
import edu.codespring.sportgh.security.SecurityUtil;
import edu.codespring.sportgh.service.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.io.InputStream;
import java.util.Collection;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
public abstract class BaseDataGenerator {

    @Value("${test.file.storage.location}")
    protected String testFileStorageLocation;

    protected final UserService userService;
    protected final CategoryService categoryService;
    protected final SubCategoryService subCategoryService;
    protected final ProductService productService;
    protected final FirebaseService firebaseService;
    protected final ImageService imageService;

    @Value("${data.storage.location}")
    private String storageLocation;

    @PostConstruct
    public void init() {
        List<Category> categories;
        List<SubCategory> subcategories;
        List<Product> products;
        List<User> users;

        ObjectMapper objectMapper = new ObjectMapper();
        try (InputStream is = new ClassPathResource(storageLocation).getInputStream()) {
            DataInitialization data = objectMapper.readValue(is, DataInitialization.class);
            categories = data.getCategories();
            subcategories = data.getSubcategories();
            products = data.getProducts();
            users = data.getUsers();
        } catch (IOException e) {
            log.error("Failed to load data from JSON file.", e);
            return;
        }


        try {
            initUsers(users);
            log.info("{} Generating users: OK", this.getClass().getSimpleName());
        } catch (ServiceException e) {
            log.warn("Generating users: FAILED");
            log.warn(e.getMessage());
        }

        initCategories(categories);
        log.info("Generating categories: OK");

        initSubCategories(subcategories);
        log.info("Generating subcategories: OK");

        initProducts(products);
        log.info("Generating products: OK");
    }

    public abstract void initCategories(List<Category> categories);

    public abstract void initSubCategories(List<SubCategory> subcategories);

    public abstract void initProducts(List<Product> products);

    public void initUsers(List<User> usersFromJson) {
        // First, we'll ensure that the admin user is always present
        final String adminEmail = "admin@test.com";
        User admin = userService.findByUsername(adminEmail);
        if (admin == null) {
            admin = userService.signup(adminEmail, null, SecurityUtil.ROLE_ADMIN);
        } else {
            admin.setRole(SecurityUtil.ROLE_ADMIN);
            userService.update(admin);
        }

        // Create or update users from JSON
        for (User userJson : usersFromJson) {
            User user = userService.findByUsername(userJson.getUsername());
            if (user == null) {
                // Create user in local database and Firebase
                user = userService.signup(userJson.getEmail(), null, userJson.getRole());
                String firebaseUid = firebaseService.signupUserToFirebase(user, "defaultPassword"); // Replace with actual password logic
                user.setFirebaseUid(firebaseUid);
                userService.update(user);
            } else {
                // Update existing user details
                user.setRole(userJson.getRole());
                userService.update(user);

                // Update Firebase UID if necessary
                if (!user.getFirebaseUid().equals(userJson.getFirebaseUid())) {
                    String firebaseUid = firebaseService.updateUserToFirebase(user, "defaultPassword"); // Replace with actual password logic
                    user.setFirebaseUid(firebaseUid);
                    userService.update(user);
                }
            }
        }

        // Sync users from Firebase
        Collection<User> firebaseUsers = firebaseService.getUsers();
        for (User firebaseUser : firebaseUsers) {
            User localUser = userService.findByEmail(firebaseUser.getEmail());
            if (localUser == null) {
                // User is in Firebase but not in local DB, so we create the user locally
                localUser = userService.signup(firebaseUser.getEmail(), firebaseUser.getFirebaseUid(), SecurityUtil.ROLE_USER);
            } else {
                // User is in both systems, we ensure Firebase UID is up-to-date locally
                localUser.setFirebaseUid(firebaseUser.getFirebaseUid());
                userService.update(localUser);
            }
        }

        // Ensure all local users are in Firebase
        Collection<User> localUsers = userService.findAll();
        for (User localUser : localUsers) {
            if (localUser.getFirebaseUid() == null || !firebaseService.userExistsInFirebase(localUser.getEmail())) {
                // User exists locally but not in Firebase, so we add them to Firebase
                String firebaseUid = firebaseService.signupUserToFirebase(localUser, "defaultPassword"); // Replace with actual password logic
                localUser.setFirebaseUid(firebaseUid);
                userService.update(localUser);
            }
        }
    }


    public void saveCategory(String name, String description, String imageUrl) {
        if (!categoryService.existsByName(name)) {
            String imageName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
            String urlWithoutImageName = imageUrl.substring(0, imageUrl.lastIndexOf('/'));
            Image image = new Image(imageName, urlWithoutImageName);
            Category category = new Category(name, description, image);
            categoryService.save(category);
            imageService.save(image);
        }
    }

    public void saveSubcategory(String name, String categoryName) {
        Category category = categoryService.findByName(categoryName);
        if (category != null && !subCategoryService.existsByName(name)) {
            subCategoryService.save(new SubCategory(name, category, null));
        }
    }

    public void saveProduct(Product product, String subCategoryName, User user) {
        SubCategory subCategory = subCategoryService.findByName(subCategoryName);
        if (subCategory != null && productService.notExistsByNameAndUser(product.getName(), user)) {
            productService.save(new Product(true, product.getName(), product.getDescription(),
                    product.getLocation(), product.getRentPrice(),
                    subCategory, user, null, null));
        }
    }
}
