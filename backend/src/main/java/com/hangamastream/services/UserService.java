package com.hangamastream.services;

import java.util.concurrent.CompletableFuture;

import com.hangamastream.config.jwt.JwtResponse;
import com.hangamastream.models.user.User;
import com.hangamastream.models.user.forms.UpdateUserForm;
import com.hangamastream.models.user.forms.UserLoginForm;
import com.hangamastream.models.user.forms.UserRegisterForm;

public interface UserService {

    CompletableFuture<User> createUser(UserRegisterForm registerForm);
    CompletableFuture<User> updateUser(UpdateUserForm updatedUser, int userId);
    CompletableFuture<Void> deleteUser(int userId);

    CompletableFuture<User> getUser(int userId);
    CompletableFuture<User> getUser(String email);

    CompletableFuture<JwtResponse> authenticateUser(UserLoginForm loginForm);
    
    
}
