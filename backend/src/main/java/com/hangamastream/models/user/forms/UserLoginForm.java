package com.hangamastream.models.user.forms;

import lombok.Data;

@Data
public class UserLoginForm {
    private String email;
    private String password;
}
