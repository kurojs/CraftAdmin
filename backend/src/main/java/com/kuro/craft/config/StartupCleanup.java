package com.kuro.craft.config;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import java.time.Instant;

import com.kuro.craft.service.IngestService;

@Component
public class StartupCleanup implements ApplicationRunner {

  private final IngestService ingestService;

  public StartupCleanup(IngestService ingestService) {
    this.ingestService = ingestService;
  }

  @Override
  public void run(ApplicationArguments args) throws Exception {
    ingestService.closeAllSessions(Instant.now());
  }
}
