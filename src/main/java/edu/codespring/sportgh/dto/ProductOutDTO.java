package edu.codespring.sportgh.dto;

import lombok.Data;

@Data
public class ProductOutDTO {

    private Long id;
    private boolean publicContact;
    private String name;
    private String description;
    private String location;
    private Double rentPrice;
    private Long categoryId;
    private String categoryName;
    private Long subCategoryId;
    private String subCategoryName;
    private Long userId;
    private String username;
    private Long[] imageIds;
}
