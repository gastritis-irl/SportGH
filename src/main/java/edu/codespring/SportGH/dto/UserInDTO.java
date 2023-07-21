package edu.codespring.SportGH.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserInDTO {
    @Size(min = 5, max = 25)
    @NotNull
    private String userName;
    @Size(min = 8, max = 32)
    @NotNull
    @Pattern(regexp = "[a-zA-Z0-9]+")
    private String password;
}