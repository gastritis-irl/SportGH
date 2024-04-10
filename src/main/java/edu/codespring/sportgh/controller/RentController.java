package edu.codespring.sportgh.controller;

import edu.codespring.sportgh.dto.RentRequestOutDTO;
import edu.codespring.sportgh.dto.UserOutDTO;
import edu.codespring.sportgh.mapper.RentRequestMapper;
import edu.codespring.sportgh.mapper.UserMapper;
import edu.codespring.sportgh.model.Product;
import edu.codespring.sportgh.model.RentRequest;
import edu.codespring.sportgh.model.User;
import edu.codespring.sportgh.security.SecurityUtil;
import edu.codespring.sportgh.service.ProductService;
import edu.codespring.sportgh.service.RentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("api/rent")
@RequiredArgsConstructor
@Slf4j
public class RentController {

    private final ProductService productService;
    private final UserMapper userMapper;
    private final RentService rentService;
    private final RentRequestMapper rentRequestMapper;

    @GetMapping("/user")
    public ResponseEntity<UserOutDTO> getProductOwnerInfo(@RequestParam("productId") Optional<Long> productId) {
        User user = SecurityUtil.getCurrentUser();
        if (productId.isEmpty() || user == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Product product = productService.findById(productId.get());
        if (product == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        if (product.getUser().getId().equals(user.getId())) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        if (product.isPublicContact()) {
            return new ResponseEntity<>(userMapper.userToOut(product.getUser()), HttpStatus.OK);
        }

        RentRequest rentRequest = rentService.findByRenterAndProduct(user, product);
        if (rentRequest == null) {
            // create rent request
            rentService.createRentRequest(user, product);
            return new ResponseEntity<>(HttpStatus.MOVED_PERMANENTLY);
        } else {
            return checkRentRequest(rentRequest);
        }
    }

    @GetMapping("/owned")
    public ResponseEntity<Collection<RentRequestOutDTO>> getOthersRequestsForMe() {
        User user = SecurityUtil.getCurrentUser();
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        return new ResponseEntity<>(
            rentRequestMapper.rentRequestsToOuts(rentService.findByOwnerId(user.getId())),
            HttpStatus.OK
        );
    }

    @GetMapping("/sent")
    public ResponseEntity<Collection<RentRequestOutDTO>> getMyRequests() {
        User user = SecurityUtil.getCurrentUser();
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        return new ResponseEntity<>(
            rentRequestMapper.rentRequestsToOuts(rentService.findByRenterId(user.getId())),
            HttpStatus.OK
        );
    }

    @PutMapping
    public ResponseEntity<?> answerRentRequest(@RequestParam Optional<Long> requestId,
                                               @RequestParam Optional<String> answer) {
        User user = SecurityUtil.getCurrentUser();
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        return answerRequest(user, requestId, answer);
    }

    private ResponseEntity<UserOutDTO> checkRentRequest(RentRequest rentRequest) {
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
                rentService.resendRentRequest(rentRequest);
                return new ResponseEntity<>(HttpStatus.SEE_OTHER);
            }
            default: {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        }
    }

    private ResponseEntity<?> answerRequest(User user,
                                            Optional<Long> requestId,
                                            Optional<String> answer) {
        if (requestId.isEmpty() || answer.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        RentRequest rentRequest = rentService.findById(requestId.get()).orElse(null);
        if (rentRequest == null || rentRequest.getRequestStatus() != RentRequest.Status.PENDING || user == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        if (!user.equals(rentRequest.getProduct().getUser()) && !(Objects.equals(user.getRole(), "ADMIN"))) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        rentRequest.setRequestStatus(
            "accept".equals(answer.get()) ? RentRequest.Status.ACCEPTED : RentRequest.Status.DECLINED
        );
        rentService.answerRentRequest(rentRequest);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
