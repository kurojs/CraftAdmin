package com.kuro.craft.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kuro.craft.dto.CreateAdminRequest;
import com.kuro.craft.exception.ConflictException;
import com.kuro.craft.model.AdminUser;
import com.kuro.craft.repository.AdminUserRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admins")
public class AdminController {

  private final AdminUserRepository adminUserRepository;
  private final PasswordEncoder passwordEncoder;

  public AdminController(AdminUserRepository adminUserRepository, PasswordEncoder passwordEncoder) {
    this.adminUserRepository = adminUserRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @PostMapping
  public ResponseEntity<Void> create(@Valid @RequestBody CreateAdminRequest request) {
    if (adminUserRepository.findByUsername(request.username()).isPresent()) {
      throw new ConflictException("El usuario ya existe");
    }

    AdminUser admin = new AdminUser();
    admin.setUsername(request.username());
    admin.setPasswordHash(passwordEncoder.encode(request.password()));
    admin.setRole(request.role());
    admin.setActive(true);
    adminUserRepository.save(admin);

    return ResponseEntity.status(HttpStatus.CREATED).build();
  }
}
