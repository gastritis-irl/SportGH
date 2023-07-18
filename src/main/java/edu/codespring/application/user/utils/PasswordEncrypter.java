package edu.codespring.application.user.utils;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class PasswordEncrypter {
    public static String generateHashedPassword(String password, String salt) {
        try {
            MessageDigest algorithm = MessageDigest.getInstance("SHA-256");
            byte[] input = (password + salt).getBytes();
            algorithm.reset();
            algorithm.update(input);
            byte[] output = algorithm.digest();
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < output.length; i++) {
                sb.append(String.format("%02x", output[i]));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }

    }
}
