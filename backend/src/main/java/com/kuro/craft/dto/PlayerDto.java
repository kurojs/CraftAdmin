package com.kuro.craft.dto;

import java.time.Instant;
import java.util.UUID;
import com.kuro.craft.model.Player;

public record PlayerDto(UUID uuid, String name, Instant firstSeen, Instant lastSeen, Long totalPlaytimeSeconds,
    boolean online, boolean banned) {

  public static PlayerDto from(Player player) {
    return new PlayerDto(player.getUuid(), player.getName(), player.getFirstSeen(), player.getLastSeen(),
        player.getTotalPlaytimeSeconds(), player.isOnline(), player.isBanned());
  }

}
