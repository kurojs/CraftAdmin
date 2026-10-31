package com.kuro.craft.dto;

import jakarta.validation.constraints.NotBlank;

public record RawRequest(@NotBlank String command) {
}
