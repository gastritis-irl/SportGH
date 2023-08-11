package edu.codespring.sportgh.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SignupRequest {

    private String email;
    private String idToken;
    private String password;
}
