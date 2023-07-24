package edu.codespring.sportgh.dto;

import lombok.Data;

@Data
public class CategoryOutDTO {

    private Long categoryID;
    private String categoryName;
    private String categoryDescription;
    private String categoryImageURL;
}
