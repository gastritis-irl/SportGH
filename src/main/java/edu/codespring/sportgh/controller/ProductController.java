package edu.codespring.sportgh.controller;

import edu.codespring.sportgh.dto.ProductInDTO;
import edu.codespring.sportgh.dto.ProductOutDTO;
import edu.codespring.sportgh.mapper.ProductMapper;
import edu.codespring.sportgh.model.Product;
import edu.codespring.sportgh.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@RestController
@RequestMapping("api/products")
@RequiredArgsConstructor
@Slf4j
public class ProductController {

    private final ProductService productService;
    private final ProductMapper productMapper;

    @GetMapping
    public Collection<ProductOutDTO> findAllProducts() {
        Collection<Product> products = productService.findAllProducts();
        return productMapper.productToOuts(products);
    }

    @PostMapping
    public ResponseEntity<ProductOutDTO> saveProduct(@RequestBody ProductInDTO productInDTO) {
        Product product = productMapper.dtoToProduct(productInDTO);
        log.info("{}", product);
        productService.saveProduct(product);
        ProductOutDTO productOutDTO = productMapper.productToOut(product);

        return new ResponseEntity<>(productOutDTO, HttpStatus.CREATED);
    }
}
