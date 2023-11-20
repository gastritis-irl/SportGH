package edu.codespring.sportgh.test;

import edu.codespring.sportgh.exception.ServiceException;
import edu.codespring.sportgh.model.Category;
import edu.codespring.sportgh.model.Product;
import edu.codespring.sportgh.model.SubCategory;
import edu.codespring.sportgh.model.User;
import edu.codespring.sportgh.service.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.List;

@Profile("data-gen")
@Slf4j
@Component
public class DataGenerator extends BaseDataGenerator {

    @Value("${test.file.storage.location}")
    private String fileStorageLocation;

    public DataGenerator(UserService userService, CategoryService categoryService,
                         SubCategoryService subCategoryService, ProductService productService,
                         FirebaseService firebaseService, ImageService imageService) {
        super(userService, categoryService, subCategoryService, productService, firebaseService, imageService);
    }

    @Override
    public void initCategories(List<Category> categories) {
        categories.forEach(category -> {
            String name = category.getName();
            String description = category.getDescription();
            String imageUrl = fileStorageLocation + category.getImage().getUrl();
            saveCategory(name, description, imageUrl);
        });
    }

    @Override
    public void initSubCategories(List<SubCategory> subcategories) {
        subcategories.forEach(subcategory -> {
            String name = subcategory.getName();
            String categoryName = subcategory.getCategory().getName();
            saveSubcategory(name, categoryName);
        });
    }

    @Override
    public void initProducts(List<Product> products) {
        products.forEach(product -> {
            User user = userService.findByEmail(product.getUser().getEmail());
            if (user == null) {
                throw new ServiceException("User doesn't exist.");
            }
            saveProduct(product, product.getSubCategory().getName(), user);
        });
    }

}
