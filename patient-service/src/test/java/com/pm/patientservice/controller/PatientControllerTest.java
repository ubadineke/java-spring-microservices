package com.pm.patientservice.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pm.patientservice.dto.PatientRequestDTO;
import com.pm.patientservice.dto.PatientResponseDTO;
import com.pm.patientservice.service.PatientService;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(PatientController.class)
class PatientControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @MockBean
  private PatientService patientService;

  @Autowired
  private ObjectMapper objectMapper;

  @Test
  void shouldReturnListOfPatients() throws Exception {
    PatientResponseDTO patient = new PatientResponseDTO();
    patient.setId(UUID.randomUUID().toString());
    patient.setName("John Doe");

    when(patientService.getPatients()).thenReturn(List.of(patient));

    mockMvc.perform(get("/patients"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].name").value("John Doe"));
  }

  @Test
  void shouldCreatePatient() throws Exception {
    PatientRequestDTO request = new PatientRequestDTO();
    request.setName("Jane Doe");
    request.setEmail("jane@example.com");
    request.setAddress("123 Street");
    request.setDateOfBirth("1990-01-01");
    request.setRegisteredDate("2023-01-01");

    PatientResponseDTO response = new PatientResponseDTO();
    response.setId(UUID.randomUUID().toString());
    response.setName("Jane Doe");

    when(patientService.createPatient(any(PatientRequestDTO.class))).thenReturn(response);

    mockMvc.perform(post("/patients")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.name").value("Jane Doe"));
  }

  @Test
  void shouldUpdatePatient() throws Exception {
    UUID id = UUID.randomUUID();
    PatientRequestDTO request = new PatientRequestDTO();
    request.setName("Jane Updated");
    request.setEmail("jane@example.com");
    request.setAddress("123 Street");
    request.setDateOfBirth("1990-01-01");

    PatientResponseDTO response = new PatientResponseDTO();
    response.setId(id.toString());
    response.setName("Jane Updated");

    when(patientService.updatePatient(eq(id), any(PatientRequestDTO.class))).thenReturn(response);

    mockMvc.perform(put("/patients/" + id)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.name").value("Jane Updated"));
  }

  @Test
  void shouldDeletePatient() throws Exception {
    UUID id = UUID.randomUUID();

    doNothing().when(patientService).deletePatient(id);

    mockMvc.perform(delete("/patients/" + id))
        .andExpect(status().isNoContent());
  }
}
