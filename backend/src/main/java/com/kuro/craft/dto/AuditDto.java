package com.kuro.craft.dto;

import java.time.Instant;

import com.kuro.craft.model.AuditLog;

public record AuditDto(
    Long id,
    String adminUsername,
    String action,
    String target,
    String detail,
    boolean success,
    Instant createdAt) {

  public static AuditDto from(AuditLog log) {
    return new AuditDto(
        log.getId(),
        log.getAdmin() == null ? null : log.getAdmin().getUsername(),
        log.getAction(),
        log.getTarget(),
        log.getDetail(),
        log.isSuccess(),
        log.getCreatedAt());
  }
}
