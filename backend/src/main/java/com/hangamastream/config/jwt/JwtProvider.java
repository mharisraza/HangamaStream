package com.hangamastream.config.jwt;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;


import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Service;

import com.hangamastream.config.UserDetailsServiceImpl;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.http.HttpServletRequest;

@Service
public class JwtProvider {

	private final JwtConfiguration jwtConfiguration;
	private final UserDetailsServiceImpl userDetailsService;

	public JwtProvider(JwtConfiguration jwtConfiguration, UserDetailsServiceImpl userDetailsService) {
		this.jwtConfiguration = jwtConfiguration;
		this.userDetailsService = userDetailsService;
	}

	// retrieve username from jwt token
	public String getUsernameFromToken(String token) {
		return getClaimFromToken(token, Claims::getSubject);
	}

	// retrieve expiration date from jwt token
	public Date getExpirationDateFromToken(String token) {
		return getClaimFromToken(token, Claims::getExpiration);
	}

	public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
		final Claims claims = getAllClaimsFromToken(token);
		return claimsResolver.apply(claims);
	}

	// for retrieveing any information from token we will need the secret key
	private Claims getAllClaimsFromToken(String token) {
		return Jwts.parser().setSigningKey(jwtConfiguration.getJwtSecretKey()).parseClaimsJws(token).getBody();
	}

	// check if the token has expired
	private Boolean isTokenExpired(String token) {
		final Date expiration = getExpirationDateFromToken(token);
		return expiration.before(new Date());
	}

	// generate token for user
	public String generateToken(UserDetails userDetails) {
		Map<String, Object> claims = new HashMap<>();
		return doGenerateToken(claims, userDetails.getUsername());
	}

	// while creating the token -
	// 1. Define claims of the token, like Issuer, Expiration, Subject, and the ID
	// 2. Sign the JWT using the HS512 algorithm and secret key.
	// 3. According to JWS Compact
	// Serialization(https://tools.ietf.org/html/draft-ietf-jose-json-web-signature-41#section-3.1)
	// compaction of the JWT to a URL-safe string
	private String doGenerateToken(Map<String, Object> claims, String subject) {

		return Jwts.builder().setClaims(claims).setSubject(subject).setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis() + jwtConfiguration.getJwtTokenExpirationTime() * 1000))
				.signWith(SignatureAlgorithm.HS512, jwtConfiguration.getJwtSecretKey()).compact();
	}

	// validate token
	public Boolean isTokenValid(String token, UserDetails userDetails) {
		final String username = getUsernameFromToken(token);
		return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
	}

    public String getTokenFromHeaderAndVerify(HttpServletRequest request) {

        String username = "";
        String token = "";

        if(request != null) {
            String requestedToken = request.getHeader("Authorization");
            if(requestedToken != null && requestedToken.startsWith(jwtConfiguration.getJwtTokenPrefix().trim())) {

                token = requestedToken.substring(jwtConfiguration.getJwtTokenPrefix().length());

                try {

                    username = this.getUsernameFromToken(token);

                    if(username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                        UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
                        
                        if(isTokenValid(requestedToken, userDetails)) { 
                            UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                            usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                            SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
                        } else {
                            // throw an exception
                        }
                    }

                } catch (Exception ex) {
                    if(ex instanceof IllegalArgumentException) {
                        // do something
                    }
                    if(ex instanceof ExpiredJwtException) {
                        // warn.
                    }
                    if(ex instanceof MalformedJwtException) {
                        // warn
                    }
                }
            }
        } else {
            return "No authorization token found.";
        }
        return token;
    }

}
