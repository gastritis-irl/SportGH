package edu.codespring.sportgh.dto;

import lombok.Data;
import java.util.Map;

@Data
public class SubCategoryOutDTO {

    private Long id;
    private String name;
    private Long categoryId;
    private Map<String, String> propertiesList;
}
