package edu.codespring.sportgh.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProductInDTO {

    private Long id;

    @Size(max = 50)
    @NotNull
    private String name;

    @Size(max = 1000)
    private String description;

    @NotNull
    private Integer rentPrice;

    @NotNull
    private Long subCategoryId;

    @NotNull
    private Long userId;
}
