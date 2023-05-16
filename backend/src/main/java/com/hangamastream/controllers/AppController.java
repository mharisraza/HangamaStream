package com.hangamastream.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.hangamastream.config.jwt.JwtResponse;
import com.hangamastream.models.user.forms.UserLoginForm;
import com.hangamastream.models.user.forms.UserRegisterForm;
import com.hangamastream.services.UserService;

import jakarta.validation.Valid;

@RestController
public class AppController {
    
    @Autowired private UserService userService;

    @PostMapping(path = "/login", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody UserLoginForm loginForm) {
        JwtResponse jwtResponse = this.userService.authenticateUser(loginForm).join();
        return ResponseEntity.ok(jwtResponse);
    }

    @PostMapping(path = "/register", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserRegisterForm registerForm) {
        this.userService.createUser(registerForm).join();
        return ResponseEntity.ok("User registered successfully.");
    }
    
}
