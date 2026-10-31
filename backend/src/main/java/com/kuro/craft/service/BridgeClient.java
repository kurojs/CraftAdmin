package com.kuro.craft.service;

import java.time.Duration;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class BridgeClient {

  private final RestClient restClient;

  public BridgeClient(@Value("${app.bridge.url}") String url,
      @Value("${app.bridge.api-key}") String apiKey) {
    SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
    factory.setConnectTimeout(Duration.ofSeconds(5));
    factory.setReadTimeout(Duration.ofSeconds(5));

    this.restClient = RestClient.builder()
        .baseUrl(url)
        .defaultHeader("X-API-Key", apiKey)
        .requestFactory(factory)
        .build();
  }

  public CommandResult run(String command) {
    try {
      BridgeResponse response = restClient.post()
          .uri("/cmd")
          .contentType(MediaType.APPLICATION_JSON)
          .body(Map.of("command", command))
          .retrieve()
          .body(BridgeResponse.class);

      if (response == null) {
        return new CommandResult(false, "Puente no disponible");
      }

      return new CommandResult(response.ok(), response.response());
    } catch (Exception ex) {
      return new CommandResult(false, "Puente no disponible");
    }
  }

  public record CommandResult(boolean ok, String response) {
  }

  private record BridgeResponse(boolean ok, String response) {
  }
}
