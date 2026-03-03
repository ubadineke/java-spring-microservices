package com.pm.authservice.util;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

import io.jsonwebtoken.JwtException;
import java.util.Base64;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class JwtUtilTest {

  private JwtUtil jwtUtil;
  
  // A base64 encoded secret key (at least 256 bits for HMAC-SHA256)
  private final String secret = Base64.getEncoder().encodeToString(
      "secret-key-must-be-at-least-thirty-two-bytes-long".getBytes());

  @BeforeEach
  void setUp() {
    jwtUtil = new JwtUtil(secret);
  }

  @Test
  void shouldGenerateAndValidateToken() {
    String token = jwtUtil.generateToken("test@example.com", "ROLE_USER");
    assertDoesNotThrow(() -> jwtUtil.validateToken(token));
  }

  @Test
  void shouldThrowExceptionForInvalidToken() {
    String invalidToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0QGV4YW1wbGUuY29tIiwicm9sZSI6IlJPTEVfVVNFUiIsImlhdCI6MTYyNjQzMTIwMCwiZXhwIjoxNjI2NDcxMjAwfQ.wrong-signature";
    assertThrows(JwtException.class, () -> jwtUtil.validateToken(invalidToken));
  }
}
