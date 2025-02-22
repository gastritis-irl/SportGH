package edu.codespring.sportgh.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CategoryInDTO {

    @Min(value = 1, message = "CategoryId must be greater or equal than 1")
    private Long id;

    @Size(min = 4, max = 25, message = "Category name must be between 4-25 characters")
    @NotNull(message = "Category name can't be empty")
    private String name;

    @Size(max = 1000, message = "Category description must be between 0-1000 characters")
    private String description;

    private Long imageId;
}
