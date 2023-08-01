package edu.codespring.sportgh.dto;

import lombok.Data;

@Data
public class ProductOutDTO {

    private Long id;
    private String name;
    private String description;
    private Integer rentPrice;
    private Long subCategoryId;
    private Long userId;
}
