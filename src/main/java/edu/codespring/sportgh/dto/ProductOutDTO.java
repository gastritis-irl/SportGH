package edu.codespring.sportgh.dto;

import lombok.Data;

@Data
public class ProductOutDTO {

    private Long productId;
    private String productName;
    private String productDescription;
    private Integer productRentPrice;
    private Long subCategoryId;
    private Long userId;
}
