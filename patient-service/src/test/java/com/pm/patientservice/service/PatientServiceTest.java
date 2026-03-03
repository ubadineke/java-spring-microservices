package com.pm.patientservice.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.pm.patientservice.dto.PatientRequestDTO;
import com.pm.patientservice.dto.PatientResponseDTO;
import com.pm.patientservice.exception.EmailAlreadyExistsException;
import com.pm.patientservice.grpc.BillingServiceGrpcClient;
import com.pm.patientservice.kafka.KafkaProducer;
import com.pm.patientservice.model.Patient;
import com.pm.patientservice.repository.PatientRepository;
import java.time.LocalDate;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PatientServiceTest {

  @Mock
  private PatientRepository patientRepository;

  @Mock
  private BillingServiceGrpcClient billingServiceGrpcClient;

  @Mock
  private KafkaProducer kafkaProducer;

  @InjectMocks
  private PatientService patientService;

  private PatientRequestDTO requestDTO;
  private Patient patient;

  @BeforeEach
  void setUp() {
    requestDTO = new PatientRequestDTO();
    requestDTO.setName("John Doe");
    requestDTO.setEmail("john@example.com");
    requestDTO.setAddress("123 Main St");
    requestDTO.setDateOfBirth("1990-01-01");
    requestDTO.setRegisteredDate("2023-01-01");

    patient = new Patient();
    patient.setId(UUID.randomUUID());
    patient.setName("John Doe");
    patient.setEmail("john@example.com");
    patient.setAddress("123 Main St");
    patient.setDateOfBirth(LocalDate.of(1990, 1, 1));
  }

  @Test
  void shouldCreatePatient() {
    when(patientRepository.existsByEmail(requestDTO.getEmail())).thenReturn(false);
    when(patientRepository.save(any(Patient.class))).thenReturn(patient);

    PatientResponseDTO result = patientService.createPatient(requestDTO);

    assertNotNull(result);
    assertEquals(patient.getEmail(), result.getEmail());
    verify(billingServiceGrpcClient, times(1)).createBillingAccount(anyString(), anyString(), anyString());
    verify(kafkaProducer, times(1)).sendEvent(any(Patient.class));
  }

  @Test
  void shouldThrowExceptionWhenEmailExists() {
    when(patientRepository.existsByEmail(requestDTO.getEmail())).thenReturn(true);

    assertThrows(EmailAlreadyExistsException.class, () -> patientService.createPatient(requestDTO));
  }
}
