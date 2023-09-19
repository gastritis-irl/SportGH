package edu.codespring.sportgh.controller;

import edu.codespring.sportgh.dto.UserOutDTO;
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
import org.springframework.web.bind.annotation.*;

import java.util.Objects;
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

    @PostMapping
    public ResponseEntity<UserOutDTO> rentRequest(
        // @RequestHeader("Authorization") String idToken,
        @RequestParam Optional<Long> productId
    ) {
        Long userId = 1L;   // = idToken.decode.userId
        // if (userId == null) {
        //     return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        // }
        if (productId.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Product product = productService.findById(productId.get());
        User user = userService.findById(userId);
        if (product == null || user == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        if (product.isPublicContact()) {
            return new ResponseEntity<>(userMapper.userToOut(user), HttpStatus.OK);
        } else {
            rentService.createRentRequest(user, product);
            return new ResponseEntity<>(HttpStatus.OK);
        }
    }

    private ResponseEntity<?> rentRequestAnswer(
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
        if (rentRequest == null || !Objects.equals(rentRequest.getRequestStatus(), "active") || user == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        if (user != product.getUser()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        if (Objects.equals(answer.get(), "accept")) {
            rentRequest.setRequestStatus("accepted");
        }
        if (Objects.equals(answer.get(), "decline")) {
            rentRequest.setRequestStatus("declined");
        }

        rentService.answerRentRequest(rentRequest);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping
    public ResponseEntity<?> rentRequestAnswer(
        // @RequestHeader("Authorization") String idToken,
        @RequestParam Optional<Long> productId,
        @RequestParam Optional<Long> renterId,
        @RequestParam Optional<String> answer
    ) {
        Long userId = 1L;   // = idToken.decode.userId
        return rentRequestAnswer(userId, productId, renterId, answer);
    }
}
