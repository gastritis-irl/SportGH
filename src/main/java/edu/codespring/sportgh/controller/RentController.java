package edu.codespring.sportgh.controller;

import edu.codespring.sportgh.dto.RentRequestOutDTO;
import edu.codespring.sportgh.dto.UserOutDTO;
import edu.codespring.sportgh.mapper.RentRequestMapper;
import edu.codespring.sportgh.mapper.UserMapper;
import edu.codespring.sportgh.model.Product;
import edu.codespring.sportgh.model.RentRequest;
import edu.codespring.sportgh.model.User;
import edu.codespring.sportgh.service.ProductService;
import edu.codespring.sportgh.service.RentService;
import edu.codespring.sportgh.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collection;
import java.util.Optional;

@RestController
@RequestMapping("api/rent")
@RequiredArgsConstructor
@Slf4j
public class RentController {

    private final ProductService productService;
    private final UserService userService;
    private final UserMapper userMapper;
    private final RentService rentService;
    private final RentRequestMapper rentRequestMapper;

    @GetMapping("/user")
    public ResponseEntity<UserOutDTO> getProductOwnerInfo(@RequestParam("productId") Optional<Long> productId) {
        if (productId.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Product product = productService.findById(productId.get());
        if (product == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        if (product.isPublicContact()) {
            return new ResponseEntity<>(userMapper.userToOut(product.getUser()), HttpStatus.OK);
        }

        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        log.info("A user has sent a request: {}", user);

        RentRequest rentRequest = rentService.findByRenterAndProduct(user, product);
        if (rentRequest == null) {
            // create rent request
            rentService.createRentRequest(user, product);
            return new ResponseEntity<>(HttpStatus.MOVED_PERMANENTLY);
        } else {
            switch (rentRequest.getRequestStatus()) {
                case ACCEPTED: {
                    return new ResponseEntity<>(
                            userMapper.userToOut(rentRequest.getProduct().getUser()),
                            HttpStatus.OK
                    );
                }
                case PENDING: {
                    return new ResponseEntity<>(HttpStatus.FOUND);
                }
                case DECLINED: {
                    rentService.resendRentRequest(user, product);
                    return new ResponseEntity<>(HttpStatus.SEE_OTHER);
                }
                default: {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
                }
            }
        }
    }

    @GetMapping
    public ResponseEntity<Collection<RentRequestOutDTO>> getRentRequests() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        return new ResponseEntity<>(
                rentRequestMapper.rentRequestsToOuts(rentService.findByOwnerId(user.getId())),
                HttpStatus.OK
        );
    }

    private ResponseEntity<?> answerRequest(User user,
                                            Optional<Long> productId,
                                            Optional<Long> renterId,
                                            Optional<String> answer) {
        if (renterId.isEmpty() || productId.isEmpty() || answer.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        User renter = userService.findById(renterId.get());
        Product product = productService.findById(productId.get());
        RentRequest rentRequest = rentService.findByRenterAndProduct(renter, product);
        if (rentRequest == null || rentRequest.getRequestStatus() != RentRequest.Status.PENDING || user == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        if (!user.equals(product.getUser())) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        rentRequest.setRequestStatus(
                "accept".equals(answer.get()) ? RentRequest.Status.ACCEPTED : RentRequest.Status.DECLINED
        );
        rentService.answerRentRequest(rentRequest);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping
    public ResponseEntity<?> answerRentRequest(@RequestParam Optional<Long> productId,
                                               @RequestParam Optional<Long> renterId,
                                               @RequestParam Optional<String> answer) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return answerRequest(user, productId, renterId, answer);
    }
}
