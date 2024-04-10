package edu.codespring.sportgh.dto;

import edu.codespring.sportgh.model.RentRequest;
import lombok.Data;

@Data
public class RentRequestOutDTO {

    private Long requestId;
    private String renterName;
    private String productName;
    private Long productId;
    private RentRequest.Status requestStatus;
}
