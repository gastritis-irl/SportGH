package edu.codespring.sportgh.test;

import edu.codespring.sportgh.exception.ServiceException;
import edu.codespring.sportgh.model.*;
import edu.codespring.sportgh.service.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Profile("dummy-data-gen")
@Slf4j
@Component
public class DummyDataGenerator extends BaseDataGenerator {

    public DummyDataGenerator(UserService userService, CategoryService categoryService,
                              SubCategoryService subCategoryService, ProductService productService,
                              FirebaseService firebaseService, ImageService imageService) {
        super(userService, categoryService, subCategoryService, productService, firebaseService, imageService);
    }

    @Override
    public void initCategories() {
        saveCategory(
            "DummyCategory",
            "",
            ""
        );
    }

    @Override
    public void initSubCategories() {
        saveSubcategory(
            "DummySubcategory",
            "DummyCategory"
        );
    }

    @Override
    public void initProducts() {
        User user = userService.findByUsername("akos@test.com");
        if (user == null) {
            throw new ServiceException("User doesn't exist.");
        }

        for (int i = 1; i <= 300; i++) {
            saveProduct(
                new Product(
                    true,
                    String.format("Product%d", i),
                    "",
                    "",
                    10.0 + i,
                    null,
                    null,
                        null
                ),
                "DummySubcategory",
                user
            );
        }
    }
}
