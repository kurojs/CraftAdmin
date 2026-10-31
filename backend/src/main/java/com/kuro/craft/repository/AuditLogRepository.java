package com.kuro.craft.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.kuro.craft.model.AuditLog;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

  Page<AuditLog> findAllByOrderByCreatedAtDesc(Pageable pageable);

}
