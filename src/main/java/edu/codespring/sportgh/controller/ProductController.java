package edu.codespring.sportgh.controller;

import edu.codespring.sportgh.dto.ProductInDTO;
import edu.codespring.sportgh.dto.ProductOutDTO;
import edu.codespring.sportgh.dto.ProductPageOutDTO;
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
    public ResponseEntity<ProductPageOutDTO> findPageByCategoryId(@PathVariable Long categoryId,
                                                                  @RequestParam int pageNumber) {
        return new ResponseEntity<>(productService.findPageByCategoryId(categoryId, pageNumber - 1), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ProductOutDTO> save(@RequestBody @Valid ProductInDTO productInDTO) {
        Product product = productMapper.dtoToProduct(productInDTO);
        productService.save(product);
        ProductOutDTO productOutDTO = productMapper.productToOut(product);

        return new ResponseEntity<>(productOutDTO, HttpStatus.CREATED);
    }
}
