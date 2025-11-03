package com.example.JWT.util;

import org.web3j.crypto.Keys;
import org.web3j.crypto.Sign;
import org.web3j.utils.Numeric;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;

public class SignatureVerifier {

    public static boolean verify(String walletAddress, String signature, String message) {
        try {
            byte[] msgHash = Sign.getEthereumMessageHash(message.getBytes(StandardCharsets.UTF_8));
            Sign.SignatureData sigData = signatureStringToData(signature);
            String recovered = "0x" + Keys.getAddress(Sign.signedMessageToKey(msgHash, sigData));
            return recovered.equalsIgnoreCase(walletAddress);
        } catch (Exception e) {
            return false;
        }
    }

    private static Sign.SignatureData signatureStringToData(String signature) {
        byte[] sigBytes = Numeric.hexStringToByteArray(signature);
        byte v = sigBytes[64];
        if (v < 27) v += 27;
        byte[] r = Arrays.copyOfRange(sigBytes, 0, 32);
        byte[] s = Arrays.copyOfRange(sigBytes, 32, 64);
        return new Sign.SignatureData(v, r, s);
    }
}
