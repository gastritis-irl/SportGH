package edu.codespring.sportgh.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomFieldValue {

    private String value;
    private CustomFieldConfig config;
}
