package com.simpleecom.cartservice.controller;

import com.simpleecom.cartservice.model.CartItem;
import com.simpleecom.cartservice.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Cart Service is running");
    }

    @PreAuthorize("hasRole('SUPERADMIN')")
    @GetMapping("/user/{username}")
    public ResponseEntity<List<CartItem>> getCartItemsByUsername(@PathVariable String username) {
        List<CartItem> cartItems = cartService.getCartItemsByUsername(username);
        if (cartItems.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(cartItems);
    }
}
