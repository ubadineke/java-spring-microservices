package com.pm.billingservice.grpc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import billing.BillingRequest;
import billing.BillingResponse;
import io.grpc.stub.StreamObserver;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class BillingGrpcServiceTest {

  private BillingGrpcService billingGrpcService;

  @BeforeEach
  void setUp() {
    billingGrpcService = new BillingGrpcService();
  }

  @Test
  void shouldCreateBillingAccount() {
    BillingRequest request = BillingRequest.newBuilder()
        .setPatientId("123")
        .setName("John Doe")
        .setEmail("john@example.com")
        .build();

    StreamObserver<BillingResponse> responseObserver = mock(StreamObserver.class);

    billingGrpcService.createBillingAccount(request, responseObserver);

    verify(responseObserver, times(1)).onNext(any(BillingResponse.class));
    verify(responseObserver, times(1)).onCompleted();
  }
}
