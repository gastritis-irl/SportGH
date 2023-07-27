package edu.codespring.sportgh.dto;

import lombok.Data;

@Data
public class SubCategoryOutDTO {

  private Long subCategoryId;

  private String name;

  private CategoryOutDTO category;
}
