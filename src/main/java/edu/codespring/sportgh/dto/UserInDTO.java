package edu.codespring.sportgh.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Valid
@Data
public class UserInDTO {

    @Min(value = 1, message = "UserId must be greater than or equal to 1")
    @NotNull(message = "UserId can't be empty")
    private Long id;

    @Size(min = 4, max = 64, message = "Username must be between 4-50 characters")
    @NotNull(message = "Username can't be empty")
    private String username;

    @NotNull(message = "Email can't be empty")
    private String email;

    private String fullName;

    private String phoneNumber;

    private String bio;

    private String address;

    private String city;

    private String country;

    private Long imageId;
}
