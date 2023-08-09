package edu.codespring.sportgh.utils;

import edu.codespring.sportgh.service.ServiceException;
import lombok.extern.slf4j.Slf4j;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Slf4j
public class UserUtil {

    public static String extractUsernameFromEmail(String email) {
        // Split the email at the '@' symbol and return the part before it
        return email.split("@")[0];
    }

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
            throw new ServiceException("No such algorithm!", e);
        }
    }
}
