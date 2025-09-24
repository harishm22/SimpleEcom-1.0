package com.simpleecom.productservice.service;

import com.simpleecom.productservice.model.Product;
import com.simpleecom.productservice.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public Product addProduct(Product product) {
        if (product.getId() == null) {
            product.setId(generateNextProductId());
        }
        return productRepository.save(product);
    }
    
    private Long generateNextProductId() {
        // Find the next available 4-digit ID (1000-9999)
        for (long id = 1000; id <= 9999; id++) {
            if (!productRepository.existsById(id)) {
                return id;
            }
        }
        throw new RuntimeException("No available product IDs in range 1000-9999");
    }

    public Product updateProduct(Long id, Product product) {
        Optional<Product> existingProductOpt = productRepository.findById(id);
        if (existingProductOpt.isPresent()) {
            Product existingProduct = existingProductOpt.get();
            existingProduct.setName(product.getName());
            existingProduct.setDescription(product.getDescription());
            existingProduct.setPrice(product.getPrice());
            existingProduct.setQuantity(product.getQuantity());
            existingProduct.setCategory(product.getCategory());
            existingProduct.setImageUrl(product.getImageUrl());
            System.out.println("Updating product: " + existingProduct.getName() + " with image: " + existingProduct.getImageUrl());
            return productRepository.save(existingProduct);
        } else {
            throw new RuntimeException("Product not found with id " + id);
        }
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        Optional<Product> product = productRepository.findById(id);
        return product.orElse(null);
    }

    public List<Product> getProductsByAdminUsername(String adminUsername) {
        return productRepository.findByAdminUsername(adminUsername);
    }
}
