package edu.codespring.sportgh.utils;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginRequest {

    private String idToken;
    private String password;
}
