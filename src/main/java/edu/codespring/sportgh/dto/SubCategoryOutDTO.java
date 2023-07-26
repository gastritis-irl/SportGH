package edu.codespring.sportgh.dto;

import lombok.Data;

@Data
public class SubCategoryOutDTO {

  private Long id;

  private String name;

  private CategoryOutDTO category;
}
