package com.kuro.craft.dto;

import java.time.LocalDate;

public record DayActivityDto(
    LocalDate date,
    int uniquePlayers,
    double hoursPlayed) {
}
