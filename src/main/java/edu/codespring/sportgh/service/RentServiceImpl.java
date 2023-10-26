package edu.codespring.sportgh.service;

import edu.codespring.sportgh.model.Product;
import edu.codespring.sportgh.model.RentRequest;
import edu.codespring.sportgh.model.User;
import edu.codespring.sportgh.repository.RentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Optional;

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
    public Optional<RentRequest> findById(Long requestId) {
        return rentRepository.findById(requestId);
    }

    @Override
    public Collection<RentRequest> findByProduct(Product product) {
        return rentRepository.findByProduct(product);
    }

    @Override
    public Collection<RentRequest> findByOwnerId(Long ownerId) {
        return rentRepository.findByProductOwnerId(ownerId);
    }

    @Override
    public void createRentRequest(User renter, Product product) {
        rentRepository.save(new RentRequest(renter, product, RentRequest.Status.PENDING));
    }

    @Override
    public void resendRentRequest(RentRequest rentRequest) {
        rentRepository.updateRentRequestStatus(rentRequest.getId(), RentRequest.Status.PENDING);
    }

    @Override
    public void answerRentRequest(RentRequest rentRequest) {
        rentRepository.save(rentRequest);
    }
}
