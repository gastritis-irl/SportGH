package edu.codespring.sportgh.dto;

import lombok.Data;

@Data
public class CategoryOutDTO {

  private Long categoryId;
  private String name;
  private String description;
  private String imageURL;
}
