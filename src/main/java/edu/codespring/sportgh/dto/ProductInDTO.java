package edu.codespring.sportgh.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProductInDTO {

    private Long productId;

    @Size(max = 50)
    @NotNull
    private String productName;

    @Size(max = 1000)
    private String productDescription;

    @NotNull
    private Integer productRentPrice;

    @NotNull
    private Long subCategoryId;

    @NotNull
    private Long userId;
}
