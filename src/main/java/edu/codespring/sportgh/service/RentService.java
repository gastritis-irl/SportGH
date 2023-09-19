package edu.codespring.sportgh.service;

import edu.codespring.sportgh.model.Product;
import edu.codespring.sportgh.model.RentRequest;
import edu.codespring.sportgh.model.User;

public interface RentService {

    RentRequest findByRenterAndProduct(User renter, Product product);

    void createRentRequest(User renter, Product product);

    void answerRentRequest(RentRequest rentRequest);
}
