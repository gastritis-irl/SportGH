package edu.codespring.sportgh.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProductInDTO {

    private Long id;

    private boolean available;

    @Size(max = 50)
    @NotNull
    private String name;

    @Size(max = 1000)
    private String description;

    @NotNull
    private Double rentPrice;

    @NotNull
    private Long subCategoryId;

    private String subCategoryName;

    @NotNull
    private Long userId;

    private String username;
}
