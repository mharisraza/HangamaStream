package com.hangamastream.services.impl;

import java.util.concurrent.CompletableFuture;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.hangamastream.config.jwt.JwtResponse;
import com.hangamastream.config.jwt.JwtTokenProvider;
import com.hangamastream.exceptions.ResourceNotFound;
import com.hangamastream.models.user.User;
import com.hangamastream.models.user.forms.UpdateUserForm;
import com.hangamastream.models.user.forms.UserLoginForm;
import com.hangamastream.models.user.forms.UserRegisterForm;
import com.hangamastream.repositories.UserRepository;
import com.hangamastream.services.UserService;


@Service
public class UserServiceImpl implements UserService {

    Logger log = LoggerFactory.getLogger(UserServiceImpl.class);

    private final UserRepository userRepo;
    private final BCryptPasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public UserServiceImpl(UserRepository userRepo, BCryptPasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    private void checkIfUserAlreadyExists(String email) {
        if(this.userRepo.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User already exists with this email");
        }
    }

    @Override
    @Async
    public CompletableFuture<User> createUser(UserRegisterForm registerForm) {
        this.checkIfUserAlreadyExists(registerForm.getEmail());
        try {
            User user = new User(registerForm.getEmail(), registerForm.getPassword());
            user.setPassword(passwordEncoder.encode(registerForm.getPassword()));
            return CompletableFuture.completedFuture(this.userRepo.save(user));
        } catch (Exception e) {
            log.error("USER_SERVICE: Unable to register the user with the email: " + registerForm.getEmail());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error when creating user.");
        }
    }

    @Override
    @Async
    public CompletableFuture<User> updateUser(UpdateUserForm updatedUser, int userId) {
        User userToUpdate  = this.getUser(userId).join();
        userToUpdate.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        return CompletableFuture.completedFuture(this.userRepo.save(userToUpdate));
    }

    @Override
    @Async
    public CompletableFuture<Void> deleteUser(int userId) {
        User user = this.userRepo.findById(userId).orElseThrow(() -> new ResourceNotFound("User", "ID:" + userId));
        this.userRepo.delete(user);
        return CompletableFuture.completedFuture(null);
    }

    @Override
    @Async
    public CompletableFuture<User> getUser(int userId) {
        User user = this.userRepo.findById(userId).orElseThrow(() -> new ResourceNotFound("User", "ID:" + userId));
        return CompletableFuture.completedFuture(user);
    }

    @Override
    @Async
    public CompletableFuture<User> getUser(String email) {
        User user = this.userRepo.findByEmail(email).orElseThrow(() -> new ResourceNotFound("User", "email:" + email));
        return CompletableFuture.completedFuture(user);
    }

    @Override
    @Async
    public CompletableFuture<JwtResponse> authenticateUser(UserLoginForm loginForm) {
        this.getUser(loginForm.getEmail()).join();
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(loginForm.getEmail(), loginForm.getPassword());
        try {
            authenticationManager.authenticate(authenticationToken);
            String generatedJwtToken = this.jwtTokenProvider.generateToken(authenticationToken);
            JwtResponse jwtResponse = new JwtResponse();
            jwtResponse.setToken(generatedJwtToken);
            return CompletableFuture.completedFuture(jwtResponse);
        } catch (Exception e) {
            if(e instanceof BadCredentialsException) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid email or password.");
            }
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Something went wrong.");
        }
     }
}
