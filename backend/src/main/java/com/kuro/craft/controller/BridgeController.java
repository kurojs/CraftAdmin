package com.kuro.craft.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kuro.craft.dto.IncomingEventDto;
import com.kuro.craft.service.IngestService;

@RestController
@RequestMapping("/api/bridge")
public class BridgeController {

  private final IngestService ingestService;

  public BridgeController(IngestService ingestService) {
    this.ingestService = ingestService;
  }

  @PostMapping("/events")
  public ResponseEntity<Void> receiveEvents(@RequestBody List<IncomingEventDto> events) {
    ingestService.process(events);
    return ResponseEntity.noContent().build();
  }
}
