package com.example.JWT.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class VerifyRequest {
    private String walletAddress;
    private String signature;
    private String nonce;
    private String role;
}
