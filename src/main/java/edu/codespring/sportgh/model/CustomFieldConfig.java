package edu.codespring.sportgh.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomFieldConfig {
    private String name;
    private CustomFieldType type;
}
