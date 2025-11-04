package com.example.JWT.model;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class NonceStore {
    private final Map<String, String> nonces = new ConcurrentHashMap<>();

    public String generateNonce(String walletAddress) {
        String nonce = UUID.randomUUID().toString();
        nonces.put(walletAddress.toLowerCase(), nonce);
        return nonce;
    }

    public String getNonce(String walletAddress) {
        return nonces.get(walletAddress.toLowerCase());
    }

    public void removeNonce(String walletAddress) {
        nonces.remove(walletAddress.toLowerCase());
    }
}
