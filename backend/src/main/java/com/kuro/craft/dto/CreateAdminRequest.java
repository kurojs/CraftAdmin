package com.kuro.craft.dto;

import com.kuro.craft.model.Role;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateAdminRequest(
    @NotBlank String username,
    @NotBlank String password,
    @NotNull Role role) {
}
