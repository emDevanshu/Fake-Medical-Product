package com.example.JWT.util;

import org.web3j.crypto.Keys;
import org.web3j.crypto.Sign;
import org.web3j.utils.Numeric;

import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;

public class SignatureVerifier {

//    public static boolean verify(String walletAddress, String signature, String message) {
//        try {
//            byte[] msgHash = Sign.getEthereumMessageHash(message.getBytes(StandardCharsets.UTF_8));
//            Sign.SignatureData sigData = signatureStringToData(signature);
//            BigInteger recoveredKey = Sign.signedMessageToKey(msgHash, sigData);
//            String recoveredAddress = "0x" + Keys.getAddress(recoveredKey);
//            return recoveredAddress.equalsIgnoreCase(walletAddress);
//        } catch (Exception e) {
//            e.printStackTrace();
//            return false;
//        }
//    }

//    public static boolean verify(String walletAddress, String signature, String message) {
//        try {
//            if (signature == null || signature.length() == 0) {
//                System.out.println("Signature empty");
//                return false;
//            }
//            if (message == null) {
//                System.out.println("Message empty");
//                return false;
//            }
//
//            // Normalize signature string
//            String sig = signature.startsWith("0x") ? signature.substring(2) : signature;
//            byte[] sigBytes = Numeric.hexStringToByteArray(sig);
//
//            System.out.println("Signature length (bytes): " + sigBytes.length);
//            // expect 65 bytes
//            if (sigBytes.length != 65) {
//                System.out.println("Unexpected signature length. Expected 65 bytes but got " + sigBytes.length);
//                // continue — some wallets produce 64 bytes r||s and v separated; still try to handle gracefully
//            }
//
//            // Hash the message with Ethereum prefix (same as ethers.js signMessage)
//            byte[] messageBytes = message.getBytes(StandardCharsets.UTF_8);
//            System.out.println("Message: [" + message + "]");
////            System.out.println("Message hash (hex): " + Numeric.toHexString(messageHash));
//
//            Sign.SignatureData sigData = signatureStringToData(signature);
//
//            // Debug individual parts
//            System.out.println("r: " + Numeric.toHexString(sigData.getR()));
//            System.out.println("s: " + Numeric.toHexString(sigData.getS()));
//            System.out.println("v (raw): " + sigData.getV());
//
//            // Recover public key
//            BigInteger recoveredKey = Sign.signedPrefixedMessageToKey(messageBytes, sigData);
//            String recoveredAddress = "0x" + Keys.getAddress(recoveredKey);
//
//            System.out.println("Recovered address: " + recoveredAddress);
//            System.out.println("Expected wallet: " + walletAddress);
//
//            return recoveredAddress.equalsIgnoreCase(walletAddress);
//        } catch (Exception e) {
//            e.printStackTrace();
//            return false;
//        }
//    }

public static boolean verify(String walletAddress, String signature, String message) {
    try {
        byte[] messageBytes = message.getBytes(StandardCharsets.UTF_8);
        Sign.SignatureData sigData = signatureStringToData(signature);

        BigInteger recoveredKey = Sign.signedPrefixedMessageToKey(messageBytes, sigData);
        String recoveredAddress = "0x" + Keys.getAddress(recoveredKey);

        System.out.println("Recovered address: " + recoveredAddress);
        System.out.println("Expected wallet: " + walletAddress);

        return recoveredAddress.equalsIgnoreCase(walletAddress);
    } catch (Exception e) {
        e.printStackTrace();
        return false;
    }
}

    private static Sign.SignatureData signatureStringToData(String signature) {
        byte[] sigBytes = Numeric.hexStringToByteArray(signature.startsWith("0x") ? signature.substring(2) : signature);

        // If signature is 64 bytes only (r + s) and missing v, that's uncommon for eth signatures from ethers.js,
        // but we handle defensive cases:
        if (sigBytes.length == 64) {
            // No v available — cannot recover — return something to fail gracefully
            byte[] r = Arrays.copyOfRange(sigBytes, 0, 32);
            byte[] s = Arrays.copyOfRange(sigBytes, 32, 64);
            byte v = 27; // guess — will probably fail upstream
            return new Sign.SignatureData(v, r, s);
        }

        if (sigBytes.length < 65) {
            throw new IllegalArgumentException("Signature byte array too short: " + sigBytes.length);
        }

        byte v = sigBytes[64];
        // Normalise v: some wallets return 0/1, others 27/28
        if (v < 27) {
            v += 27;
        }

        byte[] r = Arrays.copyOfRange(sigBytes, 0, 32);
        byte[] s = Arrays.copyOfRange(sigBytes, 32, 64);

        return new Sign.SignatureData(v, r, s);
    }


//    private static Sign.SignatureData signatureStringToData(String signature) {
//        byte[] sigBytes = Numeric.hexStringToByteArray(signature);
//        byte v = sigBytes[64];
//        if (v < 27) v += 27;
//        byte[] r = Arrays.copyOfRange(sigBytes, 0, 32);
//        byte[] s = Arrays.copyOfRange(sigBytes, 32, 64);
//        return new Sign.SignatureData(v, r, s);
//    }

    private static Sign.SignatureData signatureDataFromHex(String signatureHex) {
        byte[] sigBytes = Numeric.hexStringToByteArray(signatureHex);

        byte v = sigBytes[64];
        if (v < 27) {
            v += 27;
        }

        byte[] r = Arrays.copyOfRange(sigBytes, 0, 32);
        byte[] s = Arrays.copyOfRange(sigBytes, 32, 64);

        return new Sign.SignatureData(v, r, s);
    }

}
