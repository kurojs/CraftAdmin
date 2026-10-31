package com.kuro.craft.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.kuro.craft.model.AdminUser;
import com.kuro.craft.model.Role;
import com.kuro.craft.repository.AdminUserRepository;

@Component
public class AdminSeeder implements ApplicationRunner {

  private final AdminUserRepository adminUserRepository;
  private final PasswordEncoder passwordEncoder;
  private final String username;
  private final String password;

  public AdminSeeder(AdminUserRepository adminUserRepository, PasswordEncoder passwordEncoder,
      @Value("${app.admin.username}") String username,
      @Value("${app.admin.password}") String password) {
    this.adminUserRepository = adminUserRepository;
    this.passwordEncoder = passwordEncoder;
    this.username = username;
    this.password = password;
  }

  @Override
  public void run(ApplicationArguments args) {
    if (adminUserRepository.count() == 0) {
      AdminUser admin = new AdminUser();
      admin.setUsername(username);
      admin.setPasswordHash(passwordEncoder.encode(password));
      admin.setRole(Role.ADMIN);
      admin.setActive(true);
      adminUserRepository.save(admin);
    }
  }
}
