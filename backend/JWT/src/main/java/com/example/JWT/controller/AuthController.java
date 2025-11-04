package com.example.JWT.controller;

import com.example.JWT.dto.VerifyRequest;
import com.example.JWT.model.User;
import com.example.JWT.service.JwtService;
import com.example.JWT.service.UserService;
import com.example.JWT.util.SignatureVerifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.web3j.crypto.Sign;
import org.web3j.utils.Numeric;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

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
//        String nonce = "Login request: " + System.currentTimeMillis();
        String nonce = UUID.randomUUID().toString();
        nonces.put(wallet.toLowerCase(), nonce);
        return Map.of("nonce", nonce);
    }


    @PostMapping("/verify")
    public ResponseEntity<?> verifySignature(@RequestBody VerifyRequest request) {
        try {
            String walletAddress = request.getWalletAddress();
            String signature = request.getSignature();
            String role = request.getRole();
            String nonce = request.getNonce();

            System.out.println("Verifying wallet: " + walletAddress);
            System.out.println("Signature: " + signature);

            if (walletAddress == null || signature == null || role == null) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "Missing walletAddress, signature or role"
                ));
            }

            // ✅ Check if nonce exists on backend
            String storedNonce = nonces.get(walletAddress.toLowerCase());
            if (storedNonce == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                        "success", false,
                        "message", "Nonce not found or expired"
                ));
            }

            boolean isValid = SignatureVerifier.verify(walletAddress, signature, storedNonce);

            if (!isValid) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                        "success", false,
                        "message", "Invalid signature"
                ));
            }

            nonces.remove(walletAddress.toLowerCase());

            // Validate role value
            if (!role.equalsIgnoreCase("MANUFACTURER") && !role.equalsIgnoreCase("SELLER")) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "Invalid role type. Must be MANUFACTURER or SELLER"
                ));
            }

            // ✅ Generate JWT token
            String token = jwtService.generateToken(walletAddress, role.toUpperCase());

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "token", token,
                    "walletAddress", walletAddress,
                    "role", role.toUpperCase()
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "Error verifying signature: " + e.getMessage()
            ));
        }
    }
}
