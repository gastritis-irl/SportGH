package edu.codespring.sportgh.dto;

import lombok.Data;

@Data
public class CategoryOutDTO {

    private Long categoryID;
    private String name;
    private String description;
    private String imageURL;
}
