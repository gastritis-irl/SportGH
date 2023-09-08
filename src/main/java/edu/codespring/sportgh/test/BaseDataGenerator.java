package edu.codespring.sportgh.test;

import edu.codespring.sportgh.model.*;
import edu.codespring.sportgh.service.*;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;

import java.util.Collection;

@Profile({"data-gen", "dummy-data-gen"})
@Slf4j
@RequiredArgsConstructor
@AllArgsConstructor
public abstract class BaseDataGenerator {

    protected final UserService userService;
    protected final CategoryService categoryService;
    protected final SubCategoryService subCategoryService;
    protected final ProductService productService;
    protected final FirebaseService firebaseService;
    protected final ImageService imageService;

    public abstract void init();

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
