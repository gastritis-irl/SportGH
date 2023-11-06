package edu.codespring.sportgh.dto;

import lombok.Data;
import org.locationtech.jts.geom.Point;

@Data
public class ProductOutDTO {

    private Long id;
    private boolean publicContact;
    private String name;
    private String description;
    private String location;
    private Point locationLngLat;
    private Double rentPrice;
    private Long categoryId;
    private String categoryName;
    private Long subCategoryId;
    private String subCategoryName;
    private Long userId;
    private String userUid;
    private String username;
    private Long[] imageIds;
}
