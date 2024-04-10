package edu.codespring.sportgh.dto;

import edu.codespring.sportgh.model.Category;
import edu.codespring.sportgh.model.Product;
import edu.codespring.sportgh.model.SubCategory;
import edu.codespring.sportgh.model.User;
import lombok.Data;

import java.util.List;

@Data
public class DataInitDTO {

    private List<Category> categories;
    private List<SubCategory> subcategories;
    private List<Product> products;
    private List<User> users;
}
