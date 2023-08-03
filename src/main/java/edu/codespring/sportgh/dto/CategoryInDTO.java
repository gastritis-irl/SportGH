package edu.codespring.sportgh.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CategoryInDTO {

    private Long id;

    @Size(min = 5, max = 25)
    @NotNull
    private String name;

    @Size(min = 8, max = 1000)
    private String description;

    private String imageURL;
}
