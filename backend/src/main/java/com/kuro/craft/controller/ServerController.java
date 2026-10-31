package com.kuro.craft.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kuro.craft.dto.ServerStatusDto;
import com.kuro.craft.service.ServerStatusService;

@RestController
@RequestMapping("/api/server")
public class ServerController {

  private final ServerStatusService serverStatusService;

  public ServerController(ServerStatusService serverStatusService) {
    this.serverStatusService = serverStatusService;
  }

  @GetMapping("/status")
  public ServerStatusDto status() {
    return serverStatusService.get();
  }
}
