package edu.codespring.sportgh.test;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.codespring.sportgh.dto.DataInitDTO;
import edu.codespring.sportgh.exception.ServiceException;
import edu.codespring.sportgh.model.*;
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

    @Value("${data.init.location}")
    private String dataInitLocation;

    @PostConstruct
    public void init() {

        ObjectMapper objectMapper = new ObjectMapper();
        try (InputStream inputStream = new ClassPathResource(dataInitLocation).getInputStream()) {
            DataInitDTO data = objectMapper.readValue(inputStream, DataInitDTO.class);

            try {
                initUsers(data.getUsers());
                log.info("{} Generating users: OK", this.getClass().getSimpleName());
            } catch (ServiceException e) {
                log.warn("{} Generating users: FAILED - {}", this.getClass().getSimpleName(), e.getMessage());
            }

            initCategories(data.getCategories());
            log.info("{} Generating categories: OK", this.getClass().getSimpleName());

            initSubCategories(data.getSubcategories());
            log.info("{} Generating subcategories: OK", this.getClass().getSimpleName());

            initProducts(data.getProducts());
            log.info("{} Generating products: OK", this.getClass().getSimpleName());

        } catch (IOException e) {
            log.error(this.getClass().getSimpleName() + "Failed to load data from JSON file.", e);
        }
    }

    public abstract void initCategories(List<Category> categories);

    public abstract void initSubCategories(List<SubCategory> subcategories);

    public abstract void initProducts(List<Product> products);

    public void initUsers(List<User> usersFromJson) {
        updateLocalUsers(usersFromJson);

        syncLocalUsersWithFirebase();
    }

    private void updateLocalUsers(List<User> usersFromJson) {
        for (User userJson : usersFromJson) {
            User localUser = userService.findByEmail(userJson.getEmail());

            if (localUser == null) {
                localUser = userService.signup(userJson.getEmail(), null, userJson.getRole());
                syncUserWithFirebase(localUser);
            } else {
                localUser.setRole(userJson.getRole());
                if (needsFirebaseSync(localUser, userJson)) {
                    syncUserWithFirebase(localUser);
                } else {
                    userService.update(localUser);
                }
            }
        }
    }

    private boolean needsFirebaseSync(User localUser, User userJson) {
        return localUser.getFirebaseUid() == null || !localUser.getFirebaseUid().equals(userJson.getFirebaseUid());
    }

    private void syncUserWithFirebase(User user) {
        if (user.getFirebaseUid() == null || !firebaseService.userExistsInFirebase(user.getEmail())) {
            String firebaseUid = firebaseService.signupUserToFirebase(user, "password");
            user.setFirebaseUid(firebaseUid);
        }
        userService.update(user);
    }

    private void syncLocalUsersWithFirebase() {
        Collection<User> localUsers = userService.findAll();
        for (User localUser : localUsers) {
            syncUserWithFirebase(localUser);
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
