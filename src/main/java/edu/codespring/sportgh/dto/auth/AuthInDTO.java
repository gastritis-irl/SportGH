package edu.codespring.sportgh.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthInDTO {

    private String email;
    private String idToken;
}
