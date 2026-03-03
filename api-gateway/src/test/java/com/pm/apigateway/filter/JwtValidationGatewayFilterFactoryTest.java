package com.pm.apigateway.filter;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.mock.http.server.reactive.MockServerHttpRequest;
import org.springframework.mock.web.server.MockServerWebExchange;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

class JwtValidationGatewayFilterFactoryTest {

  private JwtValidationGatewayFilterFactory filterFactory;
  private WebClient.Builder webClientBuilder;
  private WebClient webClient;
  private WebClient.RequestHeadersUriSpec requestHeadersUriSpec;
  private WebClient.RequestHeadersSpec requestHeadersSpec;
  private WebClient.ResponseSpec responseSpec;

  @BeforeEach
  void setUp() {
    webClientBuilder = mock(WebClient.Builder.class);
    webClient = mock(WebClient.class);
    requestHeadersUriSpec = mock(WebClient.RequestHeadersUriSpec.class);
    requestHeadersSpec = mock(WebClient.RequestHeadersSpec.class);
    responseSpec = mock(WebClient.ResponseSpec.class);

    when(webClientBuilder.baseUrl(anyString())).thenReturn(webClientBuilder);
    when(webClientBuilder.build()).thenReturn(webClient);
    
    filterFactory = new JwtValidationGatewayFilterFactory(webClientBuilder, "http://auth-service");
  }

  @Test
  void shouldReturnUnauthorizedWhenNoToken() {
    MockServerHttpRequest request = MockServerHttpRequest.get("/api/patients")
        .build();
    MockServerWebExchange exchange = MockServerWebExchange.from(request);
    GatewayFilterChain chain = mock(GatewayFilterChain.class);

    GatewayFilter filter = filterFactory.apply(new Object());
    
    Mono<Void> result = filter.filter(exchange, chain);

    StepVerifier.create(result).verifyComplete();
    assertEquals(HttpStatus.UNAUTHORIZED, exchange.getResponse().getStatusCode());
  }

  @Test
  void shouldReturnUnauthorizedWhenInvalidTokenFormat() {
    MockServerHttpRequest request = MockServerHttpRequest.get("/api/patients")
        .header(HttpHeaders.AUTHORIZATION, "InvalidToken")
        .build();
    MockServerWebExchange exchange = MockServerWebExchange.from(request);
    GatewayFilterChain chain = mock(GatewayFilterChain.class);

    GatewayFilter filter = filterFactory.apply(new Object());
    
    Mono<Void> result = filter.filter(exchange, chain);

    StepVerifier.create(result).verifyComplete();
    assertEquals(HttpStatus.UNAUTHORIZED, exchange.getResponse().getStatusCode());
  }

  @Test
  void shouldValidateTokenAndContinueChain() {
    String token = "Bearer valid-token";
    MockServerHttpRequest request = MockServerHttpRequest.get("/api/patients")
        .header(HttpHeaders.AUTHORIZATION, token)
        .build();
    MockServerWebExchange exchange = MockServerWebExchange.from(request);
    GatewayFilterChain chain = mock(GatewayFilterChain.class);
    
    when(chain.filter(any())).thenReturn(Mono.empty());
    
    when(webClient.get()).thenReturn(requestHeadersUriSpec);
    when(requestHeadersUriSpec.uri(anyString())).thenReturn(requestHeadersSpec);
    when(requestHeadersSpec.header(anyString(), anyString())).thenReturn(requestHeadersSpec);
    when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
    when(responseSpec.toBodilessEntity()).thenReturn(Mono.empty());

    GatewayFilter filter = filterFactory.apply(new Object());
    
    Mono<Void> result = filter.filter(exchange, chain);

    StepVerifier.create(result).verifyComplete();
    verify(chain).filter(exchange);
  }
}
