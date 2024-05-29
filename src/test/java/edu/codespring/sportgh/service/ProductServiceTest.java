package edu.codespring.sportgh.service;

import edu.codespring.sportgh.mapper.ProductMapper;
import edu.codespring.sportgh.model.Product;
import edu.codespring.sportgh.repository.ProductRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;
    @Mock
    private ProductMapper productMapper;

    private ProductService productService;

    @BeforeEach
    void setUp() {
        productService = new ProductServiceImpl(productRepository, productMapper);
    }

    @Test
    void findByIdShouldReturnTheRequestedProduct() {
        Product product = new Product();
        when(productRepository.findById(any(Long.class))).thenReturn(Optional.of(product));
        Assertions.assertEquals(product, productService.findById(1L));
    }

    @Test
    void findByIdShouldReturnNullWhenProductNotFound() {
        when(productRepository.findById(any(Long.class))).thenReturn(Optional.empty());
        Assertions.assertNull(productService.findById(-1L));
    }
}
