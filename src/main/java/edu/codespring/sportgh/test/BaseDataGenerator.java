package edu.codespring.sportgh.test;

import edu.codespring.sportgh.exception.ServiceException;
import edu.codespring.sportgh.model.*;
import edu.codespring.sportgh.service.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.Collection;

@Slf4j
@RequiredArgsConstructor
public abstract class BaseDataGenerator {

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
        Collection<User> userListFB = firebaseService.getUsers();
        log.info("FbUsers: {}", userListFB);
        for (User user : userListFB) {
            if (userService.findByFirebaseUid(user.getFirebaseUid()) == null
                && userService.findByUsername(user.getEmail()) == null) {
                userService.signup(user.getEmail(), user.getFirebaseUid());
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
        if (subCategory != null && !productService.existsByNameAndUser(product.getName(), user)) {
            productService.save(new Product(true, product.getName(), product.getDescription(),
                product.getLocation(), product.getRentPrice(),
                subCategory, user));
        }
    }
}
