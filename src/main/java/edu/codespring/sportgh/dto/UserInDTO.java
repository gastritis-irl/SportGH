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

    @NotNull(message = "FirebaseUid can't be empty")
    private String firebaseUid;

    @Size(max = 30,  message = "Full name must be less than 30 characters")
    private String fullName;

    @Size(min = 9, max = 12, message = "Phone number should be between 9 and 12 characters")
    private String phoneNumber;

    @Size(max=2000, message = "Bio must be under 2000 characters")
    private String bio;

    @Size(min = 5, max = 80, message = "Address should be between 5 and 8 characters")
    private String address;

    @Size(min = 2, max = 30, message = "City should be between 2 and 30 characters")
    private String city;

    @Size(min = 4, max = 30, message = "Country should between 4 and 30 characters")
    private String country;

    @Min(value = 1, message = "ImageID must be greater or equal to 1")
    private Long imageId;
}
