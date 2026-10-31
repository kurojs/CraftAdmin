package com.kuro.craft.service;

import java.time.Instant;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kuro.craft.dto.AuditDto;
import com.kuro.craft.dto.PageDto;
import com.kuro.craft.model.AdminUser;
import com.kuro.craft.model.AuditLog;
import com.kuro.craft.repository.AdminUserRepository;
import com.kuro.craft.repository.AuditLogRepository;

@Service
public class AuditService {

  private final AuditLogRepository auditLogRepository;
  private final AdminUserRepository adminUserRepository;

  public AuditService(AuditLogRepository auditLogRepository, AdminUserRepository adminUserRepository) {
    this.auditLogRepository = auditLogRepository;
    this.adminUserRepository = adminUserRepository;
  }

  @Transactional
  public void log(String adminUsername, String action, String target, String detail, boolean success) {
    AdminUser admin = adminUserRepository.findByUsername(adminUsername).orElse(null);

    AuditLog log = new AuditLog();
    log.setAdmin(admin);
    log.setAction(action);
    log.setTarget(target);
    log.setDetail(detail);
    log.setSuccess(success);
    log.setCreatedAt(Instant.now());
    auditLogRepository.save(log);
  }

  @Transactional(readOnly = true)
  public PageDto<AuditDto> list(int page, int size) {
    Pageable pageable = PageRequest.of(Math.max(page, 0), Math.max(1, Math.min(size, 100)));
    Page<AuditLog> result = auditLogRepository.findAllByOrderByCreatedAtDesc(pageable);
    return PageDto.from(result.map(AuditDto::from));
  }
}
