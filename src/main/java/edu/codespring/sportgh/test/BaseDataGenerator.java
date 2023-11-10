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
        try {
            Collection<User> firebaseUsers = firebaseService.getUsers();
            Collection<User> localUsers = userService.findAll();

            for (User userJson : usersFromJson) {
                User localUser = userService.findByEmail(userJson.getEmail());
                processUser(userJson, localUser, firebaseUsers);
            }

            syncLocalUsersToFirebase(localUsers, firebaseUsers);

            log.info("{} Generating users: OK", this.getClass().getSimpleName());
        } catch (ServiceException e) {
            log.warn("{} Generating users: FAILED - {}", this.getClass().getSimpleName(), e.getMessage());
        }
    }

    private void processUser(User userJson, User localUser, Collection<User> firebaseUsers) {
        boolean notInFirebase = isNotInFirebase(firebaseUsers, userJson.getEmail());
        if (localUser == null) {
            localUser = userService.signup(userJson.getEmail(), userJson.getFirebaseUid(), userJson.getRole());
        }
        if (notInFirebase) {
            localUser.setFirebaseUid(firebaseService.signupUserToFirebase(localUser, "password"));
            userService.update(localUser);
        }
    }

    private boolean isNotInFirebase(Collection<User> firebaseUsers, String email) {
        return firebaseUsers.stream().noneMatch(u -> u.getEmail().equals(email));
    }

    private void syncLocalUsersToFirebase(Collection<User> localUsers, Collection<User> firebaseUsers) {
        for (User localUser : localUsers) {
            if (isNotInFirebase(firebaseUsers, localUser.getEmail())) {
                firebaseService.signupUserToFirebase(localUser, "password");
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
