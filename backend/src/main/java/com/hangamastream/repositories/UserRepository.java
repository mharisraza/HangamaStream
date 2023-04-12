package com.hangamastream.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hangamastream.models.user.User;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
    
}
