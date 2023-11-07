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
        try (InputStream inputStream = new ClassPathResource(storageLocation).getInputStream()) {
            DataInitialization data = objectMapper.readValue(inputStream, DataInitialization.class);
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
        processUsersFromJson(usersFromJson);

        syncUsersWithFirebase();
    }

    private void processUsersFromJson(List<User> usersFromJson) {
        for (User userJson : usersFromJson) {
            User user = userService.findByEmail(userJson.getEmail());
            if (user != null) {
                updateAndSyncUser(user, userJson);
            }
        }
    }

    private void signUpAndSyncWithFirebase(User userJson) {
        User newUser = userService.signup(userJson.getEmail(), userJson.getFirebaseUid(), userJson.getRole());
        String firebaseUid = firebaseService.signupUserToFirebase(newUser, "password");
        newUser.setFirebaseUid(firebaseUid);
        userService.update(newUser);
    }

    private void updateAndSyncUser(User existingUser, User userJson) {
        existingUser.setRole(userJson.getRole());
        userService.update(existingUser);
        if (existingUser.getFirebaseUid() == null || !existingUser.getFirebaseUid().equals(userJson.getFirebaseUid())) {
            signUpAndSyncWithFirebase(existingUser);
        }
    }

    private void syncUsersWithFirebase() {
        Collection<User> firebaseUsers = firebaseService.getUsers();
        syncFirebaseUsersToLocal(firebaseUsers);
        syncLocalUsersToFirebase();
    }

    private void syncFirebaseUsersToLocal(Collection<User> firebaseUsers) {
        for (User firebaseUser : firebaseUsers) {
            User localUser = userService.findByEmail(firebaseUser.getEmail());
            if (localUser == null) {
                userService.signup(firebaseUser.getEmail(), firebaseUser.getFirebaseUid(), SecurityUtil.ROLE_USER);
            } else {
                localUser.setFirebaseUid(firebaseUser.getFirebaseUid());
                userService.update(localUser);
            }
        }
    }

    private void syncLocalUsersToFirebase() {
        Collection<User> localUsers = userService.findAll();
        for (User localUser : localUsers) {
            if (localUser.getFirebaseUid() == null || !firebaseService.userExistsInFirebase(localUser.getEmail())) {
                String firebaseUid = firebaseService.signupUserToFirebase(localUser, "password");
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
