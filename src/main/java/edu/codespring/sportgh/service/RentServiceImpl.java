package edu.codespring.sportgh.service;

import edu.codespring.sportgh.model.Product;
import edu.codespring.sportgh.model.RentRequest;
import edu.codespring.sportgh.model.User;
import edu.codespring.sportgh.repository.RentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class RentServiceImpl implements RentService {

    private final RentRepository rentRepository;

    @Override
    public RentRequest findByRenterAndProduct(User renter, Product product) {
        return rentRepository.findByRenterAndProduct(renter, product);
    }

    @Override
    public void createRentRequest(User renter, Product product) {
        rentRepository.save(new RentRequest(renter, product, "active"));
    }

    @Override
    public void answerRentRequest(RentRequest rentRequest) {
        rentRepository.save(rentRequest);
    }
}
