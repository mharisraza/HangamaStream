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

    @Value("${jwt.token.expiration}")
    private Long jwtTokenExpirationTime;

    @Value("${jwt.header}")
    private String header;

    public String getJwtTokenPrefix() {
        return jwtTokenPrefix + " ";
    }
    
}
