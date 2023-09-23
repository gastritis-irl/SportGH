package edu.codespring.sportgh.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Valid
@Data
public class ProductInDTO {

    @Min(value = 1, message = "ProductId must be greater than 1")
    private Long id;

    private boolean publicContact;

    @Size(min = 4, max = 50, message = "Product name must be between 4-50 characters")
    @NotNull(message = "Product name can't be empty.")
    private String name;

    @Size(max = 1000, message = "Product description must be between 0-1000 characters")
    private String description;

    @Size(max = 100, message = "Product location must be between 0-100 characters")
    private String location;

    @Min(value = 0, message = "Rent price must be a positive value")
    @NotNull(message = "Rend price can't be empty")
    private Double rentPrice;

    @Min(value = 1, message = "SubCategoryId must be greater than 0")
    @NotNull(message = "Subcategory must be given")
    private Long subCategoryId;

    private String subCategoryName;

    private Long userId;

    private String userUid;

    @Size(max = 8, message = "Maximum 8 images can be uploaded")
    private Long[] imageIds;
}
