package edu.codespring.sportgh.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Valid
@Data
public class ProductInDTO {

    private Long id;

    private boolean available;

    @Size(min = 5, max = 50, message = "Product name must be between 5-50 characters")
    @NotNull(message = "Product name can't be empty.")
    private String name;

    @Size(min = 0, max = 1000, message = "Product description must be between 0-1000 characters")
    private String description;

    @NotNull(message = "Rend price can't be empty")
    private Double rentPrice;

    @NotNull(message = "Subcategory must be given")
    private Long subCategoryId;

    private String subCategoryName;

    @NotNull(message = "Owner must be given")
    private Long userId;
}
