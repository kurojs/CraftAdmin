package com.kuro.craft.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.kuro.craft.dto.ErrorDto;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(NotFoundException.class)
  public ResponseEntity<ErrorDto> handleNotFoundException(NotFoundException ex) {
    return ResponseEntity.status(404).body(ErrorDto.from(404, ex.getMessage()));
  }

  @ExceptionHandler(UnauthorizedException.class)
  public ResponseEntity<ErrorDto> handleUnauthorizedException(UnauthorizedException ex) {
    return ResponseEntity.status(401).body(ErrorDto.from(401, ex.getMessage()));
  }

  @ExceptionHandler(ConflictException.class)
  public ResponseEntity<ErrorDto> handleConflictException(ConflictException ex) {
    return ResponseEntity.status(409).body(ErrorDto.from(409, ex.getMessage()));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorDto> handleValidationException(MethodArgumentNotValidException ex) {
    String message = ex.getBindingResult().getFieldErrors().stream()
        .findFirst()
        .map(error -> error.getField() + " " + error.getDefaultMessage())
        .orElse("Invalid request");

    return ResponseEntity.status(400).body(ErrorDto.from(400, message));
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ErrorDto> handleIllegalArgumentException(IllegalArgumentException ex) {
    return ResponseEntity.status(400).body(ErrorDto.from(400, ex.getMessage()));
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorDto> handleAllUncaughtException(Exception ex) {
    return ResponseEntity.status(500).body(ErrorDto.from(500, "Internal server error."));
  }
}
