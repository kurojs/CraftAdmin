package com.kuro.craft.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kuro.craft.dto.IncomingEventDto;
import com.kuro.craft.dto.ServerStatusDto;
import com.kuro.craft.dto.SyncRequest;
import com.kuro.craft.service.IngestService;
import com.kuro.craft.service.ServerStatusService;

@RestController
@RequestMapping("/api/bridge")
public class BridgeController {

  private final IngestService ingestService;
  private final ServerStatusService serverStatusService;

  public BridgeController(IngestService ingestService, ServerStatusService serverStatusService) {
    this.ingestService = ingestService;
    this.serverStatusService = serverStatusService;
  }

  @PostMapping("/events")
  public ResponseEntity<Void> receiveEvents(@RequestBody List<IncomingEventDto> events) {
    ingestService.process(events);
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/status")
  public ResponseEntity<Void> receiveStatus(@RequestBody ServerStatusDto status) {
    serverStatusService.set(status);
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/sync")
  public ResponseEntity<Void> sync(@RequestBody SyncRequest request) {
    ingestService.sync(request.online());
    return ResponseEntity.noContent().build();
  }
}
