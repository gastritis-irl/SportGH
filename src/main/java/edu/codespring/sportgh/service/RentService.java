package edu.codespring.sportgh.service;

import edu.codespring.sportgh.model.Product;
import edu.codespring.sportgh.model.RentRequest;
import edu.codespring.sportgh.model.User;

import java.util.Collection;
import java.util.Optional;

public interface RentService {

    RentRequest findByRenterAndProduct(User renter, Product product);

    Optional<RentRequest> findById(Long requestId);

    Collection<RentRequest> findByOwnerId(Long ownerId);

    Collection<RentRequest> findByRenterId(Long renterId);

    void createRentRequest(User renter, Product product);

    void resendRentRequest(RentRequest rentRequest);

    void answerRentRequest(RentRequest rentRequest);
}
