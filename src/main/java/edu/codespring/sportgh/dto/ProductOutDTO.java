package edu.codespring.sportgh.dto;

import lombok.Data;

@Data
public class ProductOutDTO {

    private Long id;
    private boolean available;
    private String name;
    private String description;
    private String location;
    private Double rentPrice;
    private Long categoryId;
    private Long subCategoryId;
    private String subCategoryName;
    private Long userId;
    private String username;
}
