package com.kuro.craft.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record KickBanRequest(
    @NotBlank @Pattern(regexp = "^[A-Za-z0-9_]{3,16}$") String name,
    @Size(max = 100) @Pattern(regexp = "^[^\\r\\n]*$") String reason) {
}
