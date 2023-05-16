package com.hangamastream.config.jwt;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;

@Configuration
@Getter
public class JwtConfiguration {

    @Value("${jwt.secret.key}")
    private String jwtSecretKey;

    @Value("${jwt.token.prefix}")
    private String jwtTokenPrefix;

    @Value("${jwt.token.expiration.time}")
    private Long jwtTokenExpirationTime;

    public String getJwtTokenPrefix() {
        return jwtTokenPrefix + " ";
    }
    
}
