package com.kuro.craft.service;

import java.time.Instant;
import java.util.concurrent.atomic.AtomicReference;

import org.springframework.stereotype.Service;

import com.kuro.craft.dto.ServerStatusDto;

@Service
public class ServerStatusService {

  private static final long MAX_AGE_SECONDS = 15;

  private final AtomicReference<ServerStatusDto> lastStatus = new AtomicReference<>();
  private final AtomicReference<Instant> lastReceivedAt = new AtomicReference<>();

  public void set(ServerStatusDto status) {
    lastStatus.set(status);
    lastReceivedAt.set(Instant.now());
  }

  public ServerStatusDto get() {
    ServerStatusDto status = lastStatus.get();
    Instant receivedAt = lastReceivedAt.get();

    if (status == null || receivedAt == null
        || receivedAt.plusSeconds(MAX_AGE_SECONDS).isBefore(Instant.now())) {
      return new ServerStatusDto(false, "", 0, 0, 0);
    }

    return status;
  }
}
