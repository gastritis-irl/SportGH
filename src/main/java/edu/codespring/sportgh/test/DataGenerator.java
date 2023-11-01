package edu.codespring.sportgh.test;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.codespring.sportgh.exception.ServiceException;
import edu.codespring.sportgh.model.Category;
import edu.codespring.sportgh.model.Product;
import edu.codespring.sportgh.model.SubCategory;
import edu.codespring.sportgh.model.User;
import edu.codespring.sportgh.service.*;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Profile("data-gen")
@Slf4j
@Component
public class DataGenerator extends BaseDataGenerator {

    @Value("${data.storage.location}")
    private String storageLocation;

    @Value("${test.file.storage.location}")
    private String fileStorageLocation;

    public DataGenerator(UserService userService, CategoryService categoryService,
                         SubCategoryService subCategoryService, ProductService productService,
                         FirebaseService firebaseService, ImageService imageService) {
        super(userService, categoryService, subCategoryService, productService, firebaseService, imageService);
    }

    @PostConstruct
    public void initData() {
        ObjectMapper objectMapper = new ObjectMapper();
        try (InputStream is = new ClassPathResource(storageLocation).getInputStream()) {
            DataInitialization data = objectMapper.readValue(is, DataInitialization.class);

            initCategories(data.getCategories());
            initSubCategories(data.getSubcategories());
            initProducts(data.getProducts());

        } catch (IOException e) {
            log.error("Failed to load data from JSON file.", e);
        }
    }

    public void initCategories(List<Category> categories) {
        categories.forEach(category -> {
            String name = category.getName();
            String description = category.getDescription();
            String imageUrl = fileStorageLocation + category.getImage().getUrl();
            saveCategory(name, description, imageUrl);
        });
    }

    public void initSubCategories(List<SubCategory> subcategories) {
        subcategories.forEach(subcategory -> {
            String name = subcategory.getName();
            String categoryName = subcategory.getCategory().getName();
            saveSubcategory(name, categoryName);
        });
    }

    public void initProducts(List<Product> products) {
        products.forEach(product -> {
            User user = userService.findByUsername(product.getUser().getUsername());
            if (user == null) {
                throw new ServiceException("User doesn't exist.");
            }
            saveProduct(product, product.getSubCategory().getName(), user);
        });
    }

}
