package com.kuro.craft.controller;

import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kuro.craft.dto.PageDto;
import com.kuro.craft.dto.PlayerDto;
import com.kuro.craft.dto.SessionDto;
import com.kuro.craft.service.PlayerService;

@RestController
@RequestMapping("/api/players")
public class PlayerController {

  private final PlayerService playerService;

  public PlayerController(PlayerService playerService) {
    this.playerService = playerService;
  }

  @GetMapping
  public PageDto<PlayerDto> getAllPlayers(
      @RequestParam(required = false) String q,
      @RequestParam(required = false) Boolean online,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size,
      @RequestParam(defaultValue = "lastSeen") String sort) {
    return playerService.list(q, online, page, size, sort);
  }

  @GetMapping("/{uuid}")
  public PlayerDto getPlayerByUuid(@PathVariable UUID uuid) {
    return playerService.get(uuid);
  }

  @GetMapping("/{uuid}/sessions")
  public PageDto<SessionDto> getPlayerSessions(
      @PathVariable UUID uuid,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size) {
    return playerService.sessions(uuid, page, size);
  }
}
