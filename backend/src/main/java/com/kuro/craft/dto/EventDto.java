package com.kuro.craft.dto;

import com.kuro.craft.model.EventType;
import com.kuro.craft.model.GameEvent;
import java.util.UUID;
import java.time.Instant;

public record EventDto(
    Long id,
    EventType type,
    UUID playerUuid,
    String playerName,
    String message,
    Double x,
    Double y,
    Double z,
    Instant createdAt) {

  public static EventDto from(GameEvent event) {
    UUID uuid = null;
    String name = null;

    if (event.getPlayer() != null) {
      uuid = event.getPlayer().getUuid();
      name = event.getPlayer().getName();
    }

    return new EventDto(
        event.getId(),
        event.getType(),
        uuid,
        name,
        event.getMessage(),
        event.getX(),
        event.getY(),
        event.getZ(),
        event.getCreatedAt());
  }
}
