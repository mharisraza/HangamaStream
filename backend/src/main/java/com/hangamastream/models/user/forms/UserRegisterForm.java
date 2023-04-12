package com.hangamastream.models.user.forms;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;


@Data
public class UserRegisterForm {

    @NotBlank(message = "Email is required.")
    @Email
    @Pattern(regexp = "^[\\w-\\.]+@gmail\\.com$", message = "Only google account email is allowed.")
    private String email;

    @NotBlank(message = "Password is required.")
    private String password;

}
