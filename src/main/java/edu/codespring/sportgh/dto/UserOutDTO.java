package edu.codespring.sportgh.dto;

import lombok.Data;

@Data
public class UserOutDTO {

    private Long id;
    private String username;
    private String firebaseUid; // added for firebase authentication
    private String role;
}

