package com.kuro.craft.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.kuro.craft.dto.LoginRequest;
import com.kuro.craft.dto.LoginResponse;
import com.kuro.craft.exception.UnauthorizedException;
import com.kuro.craft.model.AdminUser;
import com.kuro.craft.repository.AdminUserRepository;
import com.kuro.craft.security.JwtService;

@Service
public class AuthService {

  private final AdminUserRepository adminUserRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;

  public AuthService(AdminUserRepository adminUserRepository, PasswordEncoder passwordEncoder,
      JwtService jwtService) {
    this.adminUserRepository = adminUserRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
  }

  public LoginResponse login(LoginRequest request) {
    AdminUser admin = adminUserRepository.findByUsername(request.username())
        .filter(AdminUser::isActive)
        .filter(candidate -> passwordEncoder.matches(request.password(), candidate.getPasswordHash()))
        .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

    String token = jwtService.createToken(admin.getUsername(), admin.getRole());
    return new LoginResponse(token, admin.getUsername(), admin.getRole());
  }
}
