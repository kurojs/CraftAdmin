package com.kuro.craft.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kuro.craft.dto.AuditDto;
import com.kuro.craft.dto.PageDto;
import com.kuro.craft.service.AuditService;

@RestController
@RequestMapping("/api/audit")
public class AuditController {

  private final AuditService auditService;

  public AuditController(AuditService auditService) {
    this.auditService = auditService;
  }

  @GetMapping
  public PageDto<AuditDto> list(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size) {
    return auditService.list(page, size);
  }
}
