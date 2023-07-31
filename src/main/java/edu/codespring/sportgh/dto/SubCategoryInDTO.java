package edu.codespring.sportgh.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SubCategoryInDTO {

    @NotNull
    private Long subCategoryId;

    @Size(min = 5, max = 25)
    @NotNull
    private String subCategoryName;

    @NotNull
    private Long categoryId;
}

