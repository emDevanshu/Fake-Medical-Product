package com.example.JWT.service;

import com.example.JWT.model.User;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class UserService {
    private final Map<String, User> userStore = new HashMap<>();

    public User registerUser(User user) {
        userStore.put(user.getWalletAddress().toLowerCase(), user);
        return user;
    }

    public User findByWalletAddress(String walletAddress) {
        return userStore.get(walletAddress.toLowerCase());
    }

    public boolean existsByWallet(String walletAddress) {
        return userStore.containsKey(walletAddress.toLowerCase());
    }
}
