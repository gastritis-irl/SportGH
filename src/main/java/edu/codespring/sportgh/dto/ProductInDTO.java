package edu.codespring.sportgh.dto;

import edu.codespring.sportgh.model.CustomFieldValue;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

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

    private Double locationLat;

    private Double locationLng;

    @Min(value = 0, message = "Rent price must be a positive value")
    @NotNull(message = "Rend price can't be empty")
    private Double rentPrice;

    @Min(value = 1, message = "SubCategoryId must be greater than 0")
    @NotNull(message = "Subcategory must be given")
    private Long subCategoryId;

    private String subCategoryName;

    private List<CustomFieldValue> customFieldValues;

    private Long userId;

    private String userUid;

    @Size(max = 8, message = "Maximum 8 images can be uploaded")
    private Long[] imageIds;
}
