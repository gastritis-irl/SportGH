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

import java.util.Collection;


@Profile("data-gen")
@Slf4j
@RequiredArgsConstructor
@Component
public class DataGenerator {

    private final UserService userService;
    private final CategoryService categoryService;
    private final SubCategoryService subCategoryService;
    private final ProductService productService;
    private final FirebaseService firebaseService;

    @PostConstruct
    public void init() {
        // initUsers();
        initCategories();
    }

    public void initUsers() {
        Collection<User> userList = firebaseService.getUsers();
        log.info("[Init] Users: {}", userList);
    }

    public void initCategories() {
        if (!categoryService.existsByName("Water sports")) {
            categoryService.save(new Category("Water sports", "...", "", null));
        }
        if(!categoryService.existsByName("Combat sports")){
            categoryService.save(new Category("Combat sports", "...", "", null));
        }
        if(!categoryService.existsByName("Extreme sports")){
            categoryService.save(new Category("Extreme sports", "...", "", null));
        }
        if(!categoryService.existsByName("Team sports")){
            categoryService.save(new Category("Team sports", "...", "", null));
        }
        if(!categoryService.existsByName("Winter sports")){
            categoryService.save(new Category("Winter sports", "...", "", null));
        }
        if(!categoryService.existsByName("Track & Field")){
            categoryService.save(new Category("Track & Field", "...", "", null));
        }
        if(!categoryService.existsByName("Other")){
            categoryService.save(new Category("Other", "Other sports", "", null));
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
