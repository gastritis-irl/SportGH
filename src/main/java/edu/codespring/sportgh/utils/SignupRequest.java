package edu.codespring.sportgh.utils;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SignupRequest {

    private String email;
    private String idToken;
    private String password;
}
