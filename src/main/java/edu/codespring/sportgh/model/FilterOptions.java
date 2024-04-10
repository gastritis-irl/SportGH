package edu.codespring.sportgh.model;

import lombok.Data;

@Data
public class FilterOptions {

    private String orderBy;
    private String direction;
    private int pageNumber;
    private String[] subcategoryNames;
    private String[] customFieldValues;
    private Double minPrice;
    private Double maxPrice;
    private String textSearch;
    private Double locationLat;
    private Double locationLng;
    private Double locationRadius;
    private Long userId;
}
