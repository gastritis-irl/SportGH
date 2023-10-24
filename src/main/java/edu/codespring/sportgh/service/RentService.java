package edu.codespring.sportgh.service;

import edu.codespring.sportgh.model.Product;
import edu.codespring.sportgh.model.RentRequest;
import edu.codespring.sportgh.model.User;

import java.util.Collection;

public interface RentService {

    RentRequest findByRenterAndProduct(User renter, Product product);

    Collection<RentRequest> findByProduct(Product product);

    Collection<RentRequest> findByOwnerId(Long ownerId);

    void createRentRequest(User renter, Product product);

    void resendRentRequest(User renter, Product product);

    void answerRentRequest(RentRequest rentRequest);
}
