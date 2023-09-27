package edu.codespring.sportgh.dto;

import edu.codespring.sportgh.model.Product;
import edu.codespring.sportgh.model.User;
import lombok.Data;

@Data
public class RentRequestOutDTO {

    private User renter;
    private Product product;
    private String renterStatus;
}
