package com.pm.authservice.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pm.authservice.dto.LoginRequestDTO;
import com.pm.authservice.service.AuthService;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(AuthController.class)
@org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @MockBean
  private AuthService authService;

  @Autowired
  private ObjectMapper objectMapper;

  @Test
  void shouldReturnTokenOnSuccessLogin() throws Exception {
    LoginRequestDTO loginRequest = new LoginRequestDTO();
    loginRequest.setEmail("test@example.com");
    loginRequest.setPassword("password123");

    when(authService.authenticate(any(LoginRequestDTO.class))).thenReturn(Optional.of("fake-jwt-token"));

    mockMvc.perform(post("/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(loginRequest)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.token").value("fake-jwt-token"));
  }

  @Test
  void shouldReturnUnauthorizedOnFailedLogin() throws Exception {
    LoginRequestDTO loginRequest = new LoginRequestDTO();
    loginRequest.setEmail("test@example.com");
    loginRequest.setPassword("wrong-password");

    when(authService.authenticate(any(LoginRequestDTO.class))).thenReturn(Optional.empty());

    mockMvc.perform(post("/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(loginRequest)))
        .andExpect(status().isUnauthorized());
  }

  @Test
  void shouldReturnOkOnValidToken() throws Exception {
    when(authService.validateToken("valid-token")).thenReturn(true);

    mockMvc.perform(get("/validate")
            .header("Authorization", "Bearer valid-token"))
        .andExpect(status().isOk());
  }

  @Test
  void shouldReturnUnauthorizedOnInvalidToken() throws Exception {
    when(authService.validateToken("invalid-token")).thenReturn(false);

    mockMvc.perform(get("/validate")
            .header("Authorization", "Bearer invalid-token"))
        .andExpect(status().isUnauthorized());
  }

  @Test
  void shouldReturnUnauthorizedWhenBearerMissing() throws Exception {
    mockMvc.perform(get("/validate")
            .header("Authorization", "valid-token"))
        .andExpect(status().isUnauthorized());
  }
}
