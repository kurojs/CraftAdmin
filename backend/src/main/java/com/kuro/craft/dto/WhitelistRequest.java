package com.kuro.craft.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record WhitelistRequest(
    @NotBlank @Pattern(regexp = "^[A-Za-z0-9_]{3,16}$") String name,
    boolean add) {
}
