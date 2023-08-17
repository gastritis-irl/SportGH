package edu.codespring.sportgh.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CategoryInDTO {

    private Long id;

    @Size(min = 5, max = 25, message = "Category name must be between 5-25 characters")
    @NotNull(message = "Category name can't be empty")
    private String name;

    @Size(min = 0, max = 1000, message = "Category description must be between 0-1000 characters")
    private String description;

    private String imageURL;
}
