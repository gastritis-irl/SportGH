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
            return new ResponseEntity<>(HttpStatus.I_AM_A_TEAPOT);
        } else {
            switch (rentRequest.getRequestStatus()) {
                case ACCEPTED: {
                    return new ResponseEntity<>(
                            userMapper.userToOut(rentRequest.getProduct().getUser()),
                            HttpStatus.OK
                    );
                }
                case PENDING: {
                    return new ResponseEntity<>(HttpStatus.TOO_MANY_REQUESTS);
                }
                case DECLINED: {
                    rentService.resendRentRequest(user, product);
                    return new ResponseEntity<>(HttpStatus.LOCKED);
                }
            }
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<Collection<RentRequestOutDTO>> getRentRequestsByProductOrOwner(
            @RequestParam("productId") Optional<Long> productId,
            @RequestParam("ownerId") Optional<Long> ownerId
    ) {
        if (productId.isPresent() && ownerId.isPresent() || productId.isEmpty() && ownerId.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        User user = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal());
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        if (productId.isPresent()) {
            Product product = productService.findById(productId.get());
            if (product == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            if (!product.getUser().getId().equals(user.getId())) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }

            return new ResponseEntity<>(
                    rentRequestMapper.rentRequestsToOuts(rentService.findByProduct(product)),
                    HttpStatus.OK
            );
        } else {
            if (!user.getId().equals(ownerId.get())) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }

            return new ResponseEntity<>(
                    rentRequestMapper.rentRequestsToOuts(rentService.findByOwnerId(ownerId.get())),
                    HttpStatus.OK
            );
        }
    }

    @PostMapping
    public ResponseEntity<?> createRentRequest(
            @RequestParam Optional<Long> productId
    ) {
        if (productId.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        User user = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal());
        Product product = productService.findById(productId.get());
        if (product == null || user == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        if (product.isPublicContact()) {
            return new ResponseEntity<>(userMapper.userToOut(user), HttpStatus.OK);
        } else {
            if (rentService.findByRenterAndProduct(user, product) == null) {
                rentService.createRentRequest(user, product);
                return new ResponseEntity<>(HttpStatus.OK);
            } else {
                return new ResponseEntity<>(
                        "A request has already been sent to the owner. Please wait for their response.",
                        HttpStatus.BAD_REQUEST
                );
            }
        }
    }

    private ResponseEntity<?> answerRequest(
            Long ownerId,
            Optional<Long> productId,
            Optional<Long> renterId,
            Optional<String> answer
    ) {
        if (renterId.isEmpty() || productId.isEmpty() || answer.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        User renter = userService.findById(renterId.get());
        Product product = productService.findById(productId.get());
        RentRequest rentRequest = rentService.findByRenterAndProduct(renter, product);
        User user = userService.findById(ownerId);
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
    public ResponseEntity<?> answerRentRequest(
            @RequestParam Optional<Long> productId,
            @RequestParam Optional<Long> renterId,
            @RequestParam Optional<String> answer
    ) {
        Long userId = 1L;   // = idToken.decode.userId
        return answerRequest(userId, productId, renterId, answer);
    }
}
