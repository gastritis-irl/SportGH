package edu.codespring.sportgh.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.codespring.sportgh.dto.ProductInDTO;
import edu.codespring.sportgh.dto.ProductOutDTO;
import edu.codespring.sportgh.dto.ProductPageOutDTO;
import edu.codespring.sportgh.mapper.ProductMapper;
import edu.codespring.sportgh.model.FilterOptions;
import edu.codespring.sportgh.model.Product;
import edu.codespring.sportgh.security.SecurityUtil;
import edu.codespring.sportgh.service.ProductService;
import edu.codespring.sportgh.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("api/products")
@RequiredArgsConstructor
@Slf4j
public class ProductController {

    private final ProductService productService;
    private final ProductMapper productMapper;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<ProductPageOutDTO> findPageByParams(
            @RequestParam Map<String, String> params,
            @RequestParam(value = "subcategoryNames", required = false) String[] subcategoryNames
    ) {
        log.info(Arrays.toString(subcategoryNames));
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            params.remove("subcategoryNames");
            FilterOptions filterOptions = objectMapper.convertValue(params, FilterOptions.class);
            filterOptions.setSubcategoryNames(subcategoryNames);
            return new ResponseEntity<>(productService.findPageByParams(filterOptions), HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            log.warn("{}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping(path = "/{productId}")
    public ResponseEntity<ProductOutDTO> findById(@PathVariable Long productId) {
        Product product = productService.findById(productId);
        if (product == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(productMapper.productToOut(product), HttpStatus.OK);
    }

    @GetMapping(path = "/{productId}/owner")
    public ResponseEntity<Long> findOwnerIdById(@PathVariable Long productId) {
        Long ownerId = productService.findOwnerIdById(productId);
        if (ownerId == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(ownerId, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ProductOutDTO> create(@RequestBody @Valid ProductInDTO productInDTO) {
        log.info("Creating product with name: {}.", productInDTO.getName());
        if (productInDTO.getUserId() != null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        productInDTO.setUserId(userService.findByFirebaseUid(productInDTO.getUserUid()).getId());
        return productService.saveInDTO(productInDTO);
    }

    @PutMapping(path = "/{productId}")
    public ResponseEntity<ProductOutDTO> update(@RequestBody @Valid ProductInDTO productInDTO,
                                                @PathVariable Long productId) {
        log.info("Updating product with ID {}.", productId);
        if (!Objects.equals(productId, productInDTO.getId())) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        if (!productService.existsById(productId)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return productService.saveInDTO(productInDTO);
    }

    @DeleteMapping(path = "/{productId}")
    public ResponseEntity<?> delete(@PathVariable Long productId) {
        Product product = productService.findById(productId);
        if (product == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        if (!SecurityUtil.isCurrentlyLoggedIn(product.getUser())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }

        productService.delete(product);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
