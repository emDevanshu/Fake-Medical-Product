package com.example.JWT.controller;

import com.example.JWT.model.User;
import com.example.JWT.service.JwtService;
import com.example.JWT.service.UserService;
import com.example.JWT.util.SignatureVerifier;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;
    private final Map<String, String> nonces = new HashMap<>();

    public AuthController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody User user) {
        if (userService.existsByWallet(user.getWalletAddress())) {
            return Map.of("success", false, "message", "Wallet already registered");
        }
        userService.registerUser(user);
        return Map.of("success", true, "message", "User registered successfully");
    }

    @GetMapping("/nonce/{wallet}")
    public Map<String, String> getNonce(@PathVariable String wallet) {
        String nonce = "Login request: " + System.currentTimeMillis();
        nonces.put(wallet.toLowerCase(), nonce);
        return Map.of("nonce", nonce);
    }

    @PostMapping("/verify")
    public Map<String, Object> verify(@RequestBody Map<String, String> body) {
        String wallet = body.get("walletAddress");
        String signature = body.get("signature");
        String nonce = nonces.get(wallet.toLowerCase());

        boolean isValid = SignatureVerifier.verify(wallet, signature, nonce);

        if (!isValid) return Map.of("success", false, "message", "Invalid signature");

        User user = userService.findByWalletAddress(wallet);
        if (user == null) return Map.of("success", false, "message", "User not found");

        String token = jwtService.generateToken(wallet, user.getRole());
        return Map.of("success", true, "token", token, "user", user);
    }
}
