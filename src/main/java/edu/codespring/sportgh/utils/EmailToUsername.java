package edu.codespring.sportgh.utils;

public class EmailToUsername {
    public static String extractUsernameFromEmail(String email) {
        // Split the email at the '@' symbol and return the part before it
        return email.split("@")[0];
    }

}
