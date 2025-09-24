package com.simpleecom.cartservice.service;

import com.simpleecom.cartservice.model.CartItem;
import com.simpleecom.cartservice.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    public List<CartItem> getCartItemsByUsername(String username) {
        return cartRepository.findByUsername(username);
    }
}
