package edu.codespring.sportgh.service;

import edu.codespring.sportgh.model.Product;
import edu.codespring.sportgh.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Override
    public Collection<Product> findAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public void saveProduct(Product product) {
        productRepository.save(product);
        log.info("Product saved successfully ({}) with ID: {}", product.getName(), product.getId());
    }
}
