package com.pm.authservice.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import com.pm.authservice.dto.LoginRequestDTO;
import com.pm.authservice.model.User;
import com.pm.authservice.util.JwtUtil;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

  @Mock
  private UserService userService;

  @Mock
  private PasswordEncoder passwordEncoder;

  @Mock
  private JwtUtil jwtUtil;

  @InjectMocks
  private AuthService authService;

  private User testUser;
  private LoginRequestDTO loginRequest;

  @BeforeEach
  void setUp() {
    testUser = new User();
    testUser.setEmail("test@example.com");
    testUser.setPassword("encodedPassword");
    testUser.setRole("ROLE_USER");

    loginRequest = new LoginRequestDTO();
    loginRequest.setEmail("test@example.com");
    loginRequest.setPassword("password123");
  }

  @Test
  void shouldAuthenticateValidUser() {
    when(userService.findByEmail(loginRequest.getEmail())).thenReturn(Optional.of(testUser));
    when(passwordEncoder.matches(loginRequest.getPassword(), testUser.getPassword())).thenReturn(true);
    when(jwtUtil.generateToken(testUser.getEmail(), testUser.getRole())).thenReturn("test-token");

    Optional<String> result = authService.authenticate(loginRequest);

    assertTrue(result.isPresent());
    assertEquals("test-token", result.get());
  }

  @Test
  void shouldNotAuthenticateWithWrongPassword() {
    when(userService.findByEmail(loginRequest.getEmail())).thenReturn(Optional.of(testUser));
    when(passwordEncoder.matches(loginRequest.getPassword(), testUser.getPassword())).thenReturn(false);

    Optional<String> result = authService.authenticate(loginRequest);

    assertTrue(result.isEmpty());
  }

  @Test
  void shouldNotAuthenticateNonExistentUser() {
    when(userService.findByEmail(anyString())).thenReturn(Optional.empty());

    Optional<String> result = authService.authenticate(loginRequest);

    assertTrue(result.isEmpty());
  }

  @Test
  void shouldValidateToken() {
    
    boolean isValid = authService.validateToken("token");
    
    // validateToken calls jwtUtil.validateToken(token) which returns void or throws exception
    // In AuthService:
    // try { jwtUtil.validateToken(token); return true; } catch (JwtException e) { return false; }
    
    assertTrue(isValid);
  }
}
