package com.kuro.craft.service;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kuro.craft.dto.PageDto;
import com.kuro.craft.dto.PlayerDto;
import com.kuro.craft.dto.SessionDto;
import com.kuro.craft.exception.NotFoundException;
import com.kuro.craft.model.Player;
import com.kuro.craft.repository.PlayerRepository;
import com.kuro.craft.repository.PlaySessionRepository;

@Service
@Transactional(readOnly = true)
public class PlayerService {

  private final PlayerRepository playerRepository;
  private final PlaySessionRepository playSessionRepository;

  public PlayerService(PlayerRepository playerRepository, PlaySessionRepository playSessionRepository) {
    this.playerRepository = playerRepository;
    this.playSessionRepository = playSessionRepository;
  }

  public PageDto<PlayerDto> list(String q, Boolean online, int page, int size, String sort) {
    Pageable pageable = PageRequest.of(Math.max(page, 0), pageSize(size), sortOf(sort));

    Page<Player> result;
    if (hasText(q) && online != null) {
      result = playerRepository.findByNameContainingIgnoreCaseAndOnline(q, online, pageable);
    } else if (hasText(q)) {
      result = playerRepository.findByNameContainingIgnoreCase(q, pageable);
    } else if (online != null) {
      result = playerRepository.findByOnline(online, pageable);
    } else {
      result = playerRepository.findAll(pageable);
    }

    return PageDto.from(result.map(PlayerDto::from));
  }

  public PlayerDto get(UUID uuid) {
    return PlayerDto.from(find(uuid));
  }

  public PageDto<SessionDto> sessions(UUID uuid, int page, int size) {
    Player player = find(uuid);
    Pageable pageable = PageRequest.of(Math.max(page, 0), pageSize(size));
    return PageDto.from(playSessionRepository.findByPlayerOrderByJoinedAtDesc(player, pageable).map(SessionDto::from));
  }

  private Player find(UUID uuid) {
    return playerRepository.findById(uuid)
        .orElseThrow(() -> new NotFoundException("Jugador no encontrado"));
  }

  private int pageSize(int size) {
    return Math.max(1, Math.min(size, 100));
  }

  private Sort sortOf(String sort) {
    String field = switch (sort == null ? "" : sort) {
      case "totalPlaytimeSeconds", "name" -> sort;
      default -> "lastSeen";
    };
    return Sort.by(field).descending();
  }

  private boolean hasText(String value) {
    return value != null && !value.isBlank();
  }
}
