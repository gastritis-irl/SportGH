package edu.codespring.sportgh.dto;

import edu.codespring.sportgh.model.CustomFieldValue;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class ProductOutDTO {

    private Long id;
    private boolean publicContact;
    private String name;
    private Date createdAt;
    private Date updatedAt;
    private String description;
    private Double locationLat;
    private Double locationLng;
    private Double rentPrice;
    private Long categoryId;
    private String categoryName;
    private Long subCategoryId;
    private String subCategoryName;
    private List<CustomFieldValue> customFieldValues;
    private Long userId;
    private String userUid;
    private String username;
    private Long[] imageIds;
}
