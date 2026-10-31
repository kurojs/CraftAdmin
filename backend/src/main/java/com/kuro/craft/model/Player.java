package com.kuro.craft.model;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Player {

  @Id
  private UUID uuid;

  private String name;

  private Instant firstSeen;

  private Instant lastSeen;

  private long totalPlaytimeSeconds;

  private boolean online;

  private boolean banned;

}
