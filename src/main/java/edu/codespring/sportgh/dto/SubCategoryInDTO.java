package edu.codespring.sportgh.dto;

import edu.codespring.sportgh.model.Category;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SubCategoryInDTO {

  @Size(min = 5, max = 25)
  @NotNull
  private String name;

  private Category category;
}
