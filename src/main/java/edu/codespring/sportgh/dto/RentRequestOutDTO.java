package edu.codespring.sportgh.dto;

import edu.codespring.sportgh.model.RentRequest;
import lombok.Data;

import java.util.Date;

@Data
public class RentRequestOutDTO {

    private Long requestId;
    private Date createdAt;
    private Date updatedAt;
    private String renterName;
    private String productName;
    private Long productId;
    private RentRequest.Status requestStatus;
}
