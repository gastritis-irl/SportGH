package edu.codespring.sportgh.controller;

import edu.codespring.sportgh.dto.ProductInDTO;
import edu.codespring.sportgh.dto.ProductOutDTO;
import edu.codespring.sportgh.mapper.ProductMapper;
import edu.codespring.sportgh.model.Product;
import edu.codespring.sportgh.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collection;
import java.util.Objects;

@RestController
@RequestMapping("api/products")
@RequiredArgsConstructor
@Slf4j
public class ProductController {

    private final ProductService productService;
    private final ProductMapper productMapper;

    @GetMapping
    public ResponseEntity<Collection<ProductOutDTO>> findAll() {
        Collection<Product> products = productService.findAll();
        return new ResponseEntity<>(productMapper.productsToOuts(products), HttpStatus.OK);
    }

    @GetMapping(path = "/{productId}")
    public ResponseEntity<ProductOutDTO> findById(@PathVariable Long productId) {
        Product product = productService.findById(productId);
        if (product == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(productMapper.productToOut(product), HttpStatus.OK);
    }

    @GetMapping(path = "/category/{categoryId}")
    public ResponseEntity<Collection<ProductOutDTO>> findByCategoryId(@PathVariable Long categoryId) {
        Collection<Product> products = productService.findByCategoryId(categoryId);
        return new ResponseEntity<>(productMapper.productsToOuts(products), HttpStatus.OK);
    }

    private ResponseEntity<ProductOutDTO> save(@Valid ProductInDTO productInDTO) {
        Product product = productMapper.dtoToProduct(productInDTO);
        productService.save(product);
        ProductOutDTO productOutDTO = productMapper.productToOut(product);
        return new ResponseEntity<>(productOutDTO, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ProductOutDTO> create(@RequestBody @Valid ProductInDTO productInDTO) {
        log.info("Creating product with name: {}.", productInDTO.getName());
        if (productInDTO.getId() != null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return save(productInDTO);
    }

    @PutMapping(path = "/{productId}")
    public ResponseEntity<ProductOutDTO> update(@RequestBody @Valid ProductInDTO productInDTO, @PathVariable Long productId) {
        log.info("Updating product with ID {}.", productId);
        if (!Objects.equals(productId, productInDTO.getId())) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        if (!productService.existsById(productId)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return save(productInDTO);
    }

    @PutMapping(path = "/{productId}/rent")
    public ResponseEntity<ProductOutDTO> rent(@PathVariable Long productId) {
        Product product = productService.findById(productId);
        productService.rent(product);
        return new ResponseEntity<>(productMapper.productToOut(product), HttpStatus.OK);
    }

    @DeleteMapping(path = "/{productId}")
    public ResponseEntity<?> delete(@PathVariable Long productId) {
        Product product = productService.findById(productId);
        productService.delete(product);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
