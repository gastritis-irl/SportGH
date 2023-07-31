package edu.codespring.sportgh.dto;

import lombok.Data;

@Data
public class ProductOutDTO {

    private String productName;

    private String productDescription;

    private Integer productRentPrice;

    private Long subcategoryId;

    private Long userId;
}
