package com.hangamastream.models.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "users")
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    /**
     * by default the user role will be the normal user, we need to explicitly set the role to admin if we wants to.
     */
    @Column(nullable = false)
    private UserRole role = UserRole.ROLE_USER;

    public User(String email, String password) {
        this.email = email;
        this.password = password;
    }
    
}
