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

        ObjectMapper objectMapper = new ObjectMapper();
        try (InputStream is = new ClassPathResource(storageLocation).getInputStream()) {
            DataInitialization data = objectMapper.readValue(is, DataInitialization.class);
            categories = data.getCategories();
            subcategories = data.getSubcategories();
            products = data.getProducts();
        } catch (IOException e) {
            log.error("Failed to load data from JSON file.", e);
            return;
        }

        try {
            initUsers();
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

    public void initUsers() {
        final String adminEmail = "admin@test.com";
        if (userService.findByUsername(adminEmail) == null) {
            userService.signup(adminEmail, null, SecurityUtil.ROLE_ADMIN);
        } else {
            User admin = userService.findByUsername(adminEmail);
            admin.setRole(SecurityUtil.ROLE_ADMIN);
            userService.update(admin);
        }

        Collection<User> userListFB = firebaseService.getUsers();
        for (User user : userListFB) {
            User localUser = userService.findByEmail(user.getEmail());
            if (localUser == null) {
                userService.signup(user.getEmail(), user.getFirebaseUid(), SecurityUtil.ROLE_USER);
            } else {
                localUser.setFirebaseUid(user.getFirebaseUid());
                userService.update(localUser);
            }
        }

        Collection<User> userListDB = userService.findAll();
        for (User user : userListDB) {
            if (!userListFB.contains(user)) {
                String firebaseUid = firebaseService.signupUserToFirebase(user, "password");
                user.setFirebaseUid(firebaseUid);
                userService.update(user);
                log.info("User {} successfully updated and registered to firebase.", user);
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
