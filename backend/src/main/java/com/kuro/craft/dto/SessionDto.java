package com.kuro.craft.dto;

import java.time.Instant;

import com.kuro.craft.model.PlaySession;

public record SessionDto(
    Long id,
    Instant joinedAt,
    Instant leftAt,
    Long durationSeconds) {

  public static SessionDto from(PlaySession session) {
    return new SessionDto(
        session.getId(),
        session.getJoinedAt(),
        session.getLeftAt(),
        session.getDurationSeconds());
  }
}
