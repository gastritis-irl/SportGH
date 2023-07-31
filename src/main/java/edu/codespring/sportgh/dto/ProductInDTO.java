package edu.codespring.sportgh.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProductInDTO {

    @Size(max = 50)
    @NotNull
    private String productName;

    @Size(max = 1000)
    private String productDescription;

    @Size(min = 0)
    @NotNull
    private Integer productRentPrice;

    @NotNull
    private Long subcategoryId;

    @NotNull
    private Long userId;
}
