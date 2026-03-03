package com.pm.patientservice.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.pm.patientservice.dto.PatientRequestDTO;
import com.pm.patientservice.dto.PatientResponseDTO;
import com.pm.patientservice.model.Patient;
import java.time.LocalDate;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class PatientMapperTest {

  @Test
  void shouldMapToDTO() {
    Patient patient = new Patient();
    patient.setId(UUID.randomUUID());
    patient.setName("John Doe");
    patient.setAddress("123 Main St");
    patient.setEmail("john@example.com");
    patient.setDateOfBirth(LocalDate.of(1990, 1, 1));

    PatientResponseDTO dto = PatientMapper.toDTO(patient);

    assertEquals(patient.getId().toString(), dto.getId());
    assertEquals(patient.getName(), dto.getName());
    assertEquals(patient.getAddress(), dto.getAddress());
    assertEquals(patient.getEmail(), dto.getEmail());
    assertEquals(patient.getDateOfBirth().toString(), dto.getDateOfBirth());
  }

  @Test
  void shouldMapToModel() {
    PatientRequestDTO dto = new PatientRequestDTO();
    dto.setName("John Doe");
    dto.setAddress("123 Main St");
    dto.setEmail("john@example.com");
    dto.setDateOfBirth("1990-01-01");
    dto.setRegisteredDate("2023-01-01");

    Patient patient = PatientMapper.toModel(dto);

    assertEquals(dto.getName(), patient.getName());
    assertEquals(dto.getAddress(), patient.getAddress());
    assertEquals(dto.getEmail(), patient.getEmail());
    assertEquals(LocalDate.of(1990, 1, 1), patient.getDateOfBirth());
    assertEquals(LocalDate.of(2023, 1, 1), patient.getRegisteredDate());
  }
}
