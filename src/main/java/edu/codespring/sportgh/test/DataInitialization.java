package edu.codespring.sportgh.test;

import edu.codespring.sportgh.model.Category;
import edu.codespring.sportgh.model.Product;
import edu.codespring.sportgh.model.SubCategory;
import lombok.Data;

import java.util.List;

@Data
public class DataInitialization {
    private List<Category> categories;
    private List<SubCategory> subcategories;
    private List<Product> products;
}
