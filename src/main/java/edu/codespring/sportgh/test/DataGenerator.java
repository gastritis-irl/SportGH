package edu.codespring.sportgh.test;

import edu.codespring.sportgh.model.Category;
import edu.codespring.sportgh.model.Product;
import edu.codespring.sportgh.model.SubCategory;
import edu.codespring.sportgh.model.User;
import edu.codespring.sportgh.service.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Profile("data-gen")
@Slf4j
@RequiredArgsConstructor
@Component
public class DataGenerator {

    private final UserService userService;
    private final CategoryService categoryService;
    private final SubCategoryService subCategoryService;
    private final ProductService productService;

    @PostConstruct
    public void init() {
        int nrOfUsers = 10;
        int nrOfCategories = 5;
        int nrOfSubCategories = 25;
        int nrOfProducts = 100;

        try {
            initUsers(nrOfUsers);
            initCategories(nrOfCategories);
            initSubCategories(nrOfSubCategories, nrOfCategories);
            initProducts(nrOfProducts, nrOfSubCategories, nrOfUsers);
        } catch (ServiceException e) {
            log.error(e.getMessage());
        }
    }

    public void initUsers(int nrOfUsers) {
        for (int i = 1; i <= nrOfUsers; i++) {
            String username = String.format("user%d", i);
            String password = String.format("password%d", i);
            userService.signup(username, password);
        }
    }

    public void initCategories(int nrOfCategories) {
        String[] images = {
            "https://www.bls.gov/spotlight/2017/sports-and-exercise/images/cover_image.jpg",
            "https://i0.wp.com/academiamag.com/wp-content/uploads/2017/09/sports-at-school-1.png?fit=1920%2C1280&ssl=1",
            "https://www.getyourguide.com/magazine/wp-content/migrated-content/uploads/2019/09/Header-2019.09.25-5-underrated-hiking-trails-in-Eastern-Europe-GetYourGuide.jpg",
            "https://h5d9a9f8.rocketcdn.me/wp-content/uploads/2023/03/yeti-gathering-nepal-rb-224-e1679498823335.jpg",
            "https://penaltyfile.com/wp-content/uploads/2021/03/types-of-winter-sports-Mar222021-1-min.jpg",
        };

        for (int i = 1; i <= nrOfCategories; i++) {
            String name = String.format("Category%d", i);
            String description = String.format("Category%d description", i);
            String imageURL = images[i % images.length];
            Category category = new Category(name, description, imageURL, null);
            categoryService.save(category);
        }
    }

    public void initSubCategories(int nrOfSubCategories, int nrOfCategories) {
        for (int i = 1; i <= nrOfSubCategories; i++) {
            String name = String.format("Subcategory%d", i);
            Category category = categoryService.findById((long) i % nrOfCategories + 1);
            SubCategory subCategory = new SubCategory(name, category, null);
            subCategoryService.save(subCategory);
        }
    }

    public void initProducts(int nrOfProducts, int nrOfSubCategories, int nrOfUsers) {
        for (int i = 1; i <= nrOfProducts; i++) {
            boolean available = true;
            String name = String.format("Product%d", i);
            String description = String.format("Product%d description", i);
            Double rentPrice = 75.0 + i % 35;
            SubCategory subCategory = subCategoryService.findById((long) i % nrOfSubCategories + 1);
            User user = userService.findById((long) i % nrOfUsers + 1);
            Product product = new Product(available, name, description, rentPrice, subCategory, user);
            productService.save(product);
        }
    }
}
