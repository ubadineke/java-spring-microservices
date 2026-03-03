package com.pm.analyticsservice.kafka;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import patient.events.PatientEvent;

class KafkaConsumerTest {

  private KafkaConsumer kafkaConsumer;

  @BeforeEach
  void setUp() {
    kafkaConsumer = new KafkaConsumer();
  }

  @Test
  void shouldConsumeValidEvent() {
    PatientEvent event = PatientEvent.newBuilder()
        .setPatientId("123")
        .setName("John Doe")
        .setEmail("john@example.com")
        .setEventType("CREATED")
        .build();

    byte[] eventBytes = event.toByteArray();

    assertDoesNotThrow(() -> kafkaConsumer.consumeEvent(eventBytes));
  }

  @Test
  void shouldHandleInvalidEvent() {
    byte[] invalidBytes = "invalid".getBytes();
    assertDoesNotThrow(() -> kafkaConsumer.consumeEvent(invalidBytes));
  }
}
