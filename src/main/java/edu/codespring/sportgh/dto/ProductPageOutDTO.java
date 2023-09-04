package edu.codespring.sportgh.dto;

import lombok.Data;

import java.util.Collection;

@Data
public class ProductPageOutDTO {

    Collection<ProductOutDTO> products;
    int nrOfPages;
    long nrOfElements;
}
