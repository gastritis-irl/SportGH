package edu.codespring.sportgh.test;

import edu.codespring.sportgh.exception.ServiceException;
import edu.codespring.sportgh.model.*;
import edu.codespring.sportgh.security.SecurityUtil;
import edu.codespring.sportgh.service.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;

import java.util.Collection;

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

    @PostConstruct
    public void init() {

        try {
            initUsers();
            log.info("{} Generating users: OK", this.getClass().getSimpleName());
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

    public abstract void initCategories();

    public abstract void initSubCategories();

    public abstract void initProducts();

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
                    product.getLocation(), null, product.getRentPrice(),
                    subCategory, user, null, null));
        }
    }
}
