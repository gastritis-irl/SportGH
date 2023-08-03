package edu.codespring.sportgh.dto;

import lombok.Data;

@Data
public class UserOutDTO {

    private Long userId;
    private String userName;
    private String firebaseUid; // added for firebase authentication
    private String role;
}

