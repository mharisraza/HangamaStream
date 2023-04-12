package com.hangamastream.config.jwt;

import java.util.Date;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.http.HttpServletRequest;

@Service
public class JwtTokenProvider {

    private final JwtConfiguration jwtConfiguration;

    public JwtTokenProvider(JwtConfiguration jwtConfiguration) {
        this.jwtConfiguration = jwtConfiguration;
    }

    public String generateToken(Authentication authentication) {
        String userEmail = authentication.getPrincipal().toString();
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtConfiguration.getJwtTokenExpirationTime());

        return Jwts.builder()
        .setSubject(userEmail)
        .setIssuedAt(now)
        .setExpiration(expiryDate)
        .signWith(SignatureAlgorithm.HS512, jwtConfiguration.getJwtSecretKey())
        .compact();
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parser()
        .setSigningKey(jwtConfiguration.getJwtSecretKey())
        .parseClaimsJws(token)
        .getBody()
        .getSubject();
    }

    public String getTokenFromHeader(HttpServletRequest request) {

        String authHeader = request.getHeader("Authorization");
        if(authHeader == null) {
            return null;
        }

        if(authHeader.startsWith(jwtConfiguration.getJwtTokenPrefix())) {
            String token = authHeader.substring(jwtConfiguration.getJwtTokenPrefix().length());
            if(isTokenValid(token)) {
                return token;
            }
        }
        return null;
    }

    public boolean isTokenValid(String token) {
        try {
            Jwts.parser().setSigningKey(jwtConfiguration.getJwtSecretKey()).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

}
