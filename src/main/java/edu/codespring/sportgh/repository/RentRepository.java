package edu.codespring.sportgh.repository;

import edu.codespring.sportgh.model.Product;
import edu.codespring.sportgh.model.RentRequest;
import edu.codespring.sportgh.model.User;

public interface RentRepository extends BaseRepository<RentRequest> {

    RentRequest findByRenterAndProduct(User renter, Product product);
}
