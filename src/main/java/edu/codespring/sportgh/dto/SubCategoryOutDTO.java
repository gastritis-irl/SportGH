package edu.codespring.sportgh.dto;

import edu.codespring.sportgh.model.CustomFieldConfig;
import lombok.Data;

import java.util.List;

@Data
public class SubCategoryOutDTO {

    private Long id;
    private String name;
    private Long categoryId;
    private List<CustomFieldConfig> customFields;
}
