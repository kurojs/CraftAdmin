package com.kuro.craft.dto;

import java.util.UUID;

public record OnlinePlayerDto(
    UUID uuid,
    String name) {
}
