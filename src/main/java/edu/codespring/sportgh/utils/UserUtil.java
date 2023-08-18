package edu.codespring.sportgh.utils;

import lombok.extern.slf4j.Slf4j;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Slf4j
public class UserUtil {

    public static String generateHashedPassword(String password, String salt) {
        try {
            MessageDigest algorithm = MessageDigest.getInstance("SHA-256");
            byte[] input = (password + salt).getBytes();
            algorithm.reset();
            algorithm.update(input);
            byte[] output = algorithm.digest();
            StringBuilder sb = new StringBuilder();
            for (byte outputByte : output) {
                sb.append(String.format("%02x", outputByte));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            log.error(e.getMessage());
            throw new UnsupportedOperationException("No such algorithm", e);
        }
    }
}
