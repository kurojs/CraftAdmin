package com.kuro.craft.dto;

import java.time.Instant;
import java.util.UUID;
import com.kuro.craft.model.EventType;

public record IncomingEventDto(EventType type, UUID uuid, String name, String message, String rawLine, Double x,
    Double y, Double z, Instant at) {
}
