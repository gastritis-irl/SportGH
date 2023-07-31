package edu.codespring.sportgh.dto;

import lombok.Data;

@Data
public class CategoryOutDTO {

    private Long categoryId;
    private String categoryName;
    private String categoryDescription;
    private String categoryImageURL;
}
