package edu.codespring.sportgh.dto;

import lombok.Data;

@Data
public class UserOutDTO {

    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String bio;
    private String phoneNumber;
    private String address;
    private String city;
    private String country;
    private Long imageId;
    private String role;
}

