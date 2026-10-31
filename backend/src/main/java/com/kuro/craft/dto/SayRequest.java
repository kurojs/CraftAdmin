package com.kuro.craft.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record SayRequest(
    @NotBlank @Size(max = 100) @Pattern(regexp = "^[^\\r\\n]*$") String message) {
}
