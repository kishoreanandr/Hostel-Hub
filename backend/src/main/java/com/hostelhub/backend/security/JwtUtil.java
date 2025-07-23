package com.hostelhub.backend.security;

import com.hostelhub.backend.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;

@Component
public class JwtUtil {
    private final String SECRET_KEY="hostelhub_secret_key";

    // Token Validity
    private final long EXPIRATION_TIME=24*60*60*1000;

    public String generateToken(Optional<User> user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.get().getRole().name());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.get().getEmail()) // use email as subject if it's your login id
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS384, SECRET_KEY)
                .compact();
    }
    public String extractUserRole(String token) {
        return (String) extractClaims(token).get("role");
    }

    public boolean validateToken(String username,String token){
        String extractedUsername=extractUsername(token);
        return extractedUsername.equals(username) && !isTokenExpired(token);
    }

    public boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }

    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    private Claims extractClaims(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
    }
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractClaims(token);
        return claimsResolver.apply(claims);
    }

}
