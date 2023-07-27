package edu.codespring.sportgh.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CategoryInDTO {

  @NotNull
  private Long categoryId;

  @Size(min = 5, max = 25)
  @NotNull
  private String categoryName;

  @Size(min = 8, max = 100)
  private String categoryDescription;

  private String categoryImageURL;
}
