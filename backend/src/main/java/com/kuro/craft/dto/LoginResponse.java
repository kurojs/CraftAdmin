package com.kuro.craft.dto;

import com.kuro.craft.model.Role;

public record LoginResponse(
    String token,
    String username,
    Role role) {
}
