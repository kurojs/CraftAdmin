package com.kuro.craft.dto;

import java.time.Instant;

public record ErrorDto(
    int status,
    String message,
    Instant timestamp) {

  public static ErrorDto from(int status, String message) {
    return new ErrorDto(status, message, Instant.now());
  }
}
