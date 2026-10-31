package com.kuro.craft.dto;

public record ServerStatusDto(
    boolean online,
    String version,
    int playersOnline,
    int playersMax,
    int latencyMs) {
}
