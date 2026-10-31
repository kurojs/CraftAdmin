package com.kuro.craft.service;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kuro.craft.dto.EventDto;
import com.kuro.craft.dto.IncomingEventDto;
import com.kuro.craft.dto.OnlinePlayerDto;
import com.kuro.craft.model.GameEvent;
import com.kuro.craft.model.PlaySession;
import com.kuro.craft.model.Player;
import com.kuro.craft.repository.GameEventRepository;
import com.kuro.craft.repository.PlaySessionRepository;
import com.kuro.craft.repository.PlayerRepository;

@Service
public class IngestService {

  private final PlayerRepository playerRepository;
  private final PlaySessionRepository playSessionRepository;
  private final GameEventRepository gameEventRepository;

  public IngestService(PlayerRepository playerRepository, PlaySessionRepository playSessionRepository,
      GameEventRepository gameEventRepository) {
    this.playerRepository = playerRepository;
    this.playSessionRepository = playSessionRepository;
    this.gameEventRepository = gameEventRepository;
  }

  @Transactional
  public List<EventDto> process(List<IncomingEventDto> events) {
    List<EventDto> processed = new ArrayList<>();

    for (IncomingEventDto event : events) {
      GameEvent gameEvent = switch (event.type()) {
        case JOIN -> handleJoin(event);
        case LEAVE -> handleLeave(event);
        case CHAT, DEATH, ADVANCEMENT -> handlePlayerEvent(event);
        case SERVER_START -> saveEvent(event, null);
        case SERVER_STOP -> handleServerStop(event);
      };
      processed.add(EventDto.from(gameEvent));
    }

    return processed;
  }

  @Transactional
  public void closeAllSessions(Instant now) {
    for (PlaySession session : playSessionRepository.findByLeftAtIsNull()) {
      closeSession(session, now);
    }

    for (Player player : playerRepository.findByOnlineTrue()) {
      player.setOnline(false);
      playerRepository.save(player);
    }
  }

  @Transactional
  public void sync(List<OnlinePlayerDto> online) {
    Instant now = Instant.now();
    Set<UUID> onlineIds = new HashSet<>();

    if (online != null) {
      for (OnlinePlayerDto dto : online) {
        if (dto == null || dto.uuid() == null) {
          continue;
        }

        onlineIds.add(dto.uuid());

        Player player = playerRepository.findById(dto.uuid())
            .orElseGet(() -> {
              Player created = new Player();
              created.setUuid(dto.uuid());
              created.setFirstSeen(now);
              return created;
            });

        if (dto.name() != null) {
          player.setName(dto.name());
        }
        player.setOnline(true);
        player.setLastSeen(now);
        playerRepository.save(player);

        if (playSessionRepository.findFirstByPlayerAndLeftAtIsNullOrderByJoinedAtDesc(player).isEmpty()) {
          PlaySession session = new PlaySession();
          session.setPlayer(player);
          session.setJoinedAt(now);
          playSessionRepository.save(session);
        }
      }
    }

    for (Player player : playerRepository.findByOnlineTrue()) {
      if (!onlineIds.contains(player.getUuid())) {
        playSessionRepository.findFirstByPlayerAndLeftAtIsNullOrderByJoinedAtDesc(player)
            .ifPresent(session -> closeSession(session, now));
        player.setOnline(false);
        playerRepository.save(player);
      }
    }
  }

  private GameEvent handleJoin(IncomingEventDto event) {
    Player player = findOrCreate(event);
    player.setName(event.name());
    player.setLastSeen(event.at());
    playerRepository.save(player);

    playSessionRepository.findFirstByPlayerAndLeftAtIsNullOrderByJoinedAtDesc(player)
        .ifPresent(session -> closeSession(session, event.at()));

    player.setOnline(true);
    playerRepository.save(player);

    PlaySession session = new PlaySession();
    session.setPlayer(player);
    session.setJoinedAt(event.at());
    playSessionRepository.save(session);

    return saveEvent(event, player);
  }

  private GameEvent handleLeave(IncomingEventDto event) {
    Player player = findPlayer(event);

    if (player != null) {
      playSessionRepository.findFirstByPlayerAndLeftAtIsNullOrderByJoinedAtDesc(player)
          .ifPresent(session -> closeSession(session, event.at()));
      player.setOnline(false);
      player.setLastSeen(event.at());
      playerRepository.save(player);
    }

    return saveEvent(event, player);
  }

  private GameEvent handlePlayerEvent(IncomingEventDto event) {
    return saveEvent(event, findPlayer(event));
  }

  private GameEvent handleServerStop(IncomingEventDto event) {
    closeAllSessions(event.at());
    return saveEvent(event, null);
  }

  private void closeSession(PlaySession session, Instant at) {
    session.setLeftAt(at);

    long seconds = 0;
    if (session.getJoinedAt() != null && at != null) {
      seconds = Math.max(0, Duration.between(session.getJoinedAt(), at).getSeconds());
    }
    session.setDurationSeconds(seconds);
    playSessionRepository.save(session);

    Player player = session.getPlayer();
    if (player != null) {
      player.setTotalPlaytimeSeconds(player.getTotalPlaytimeSeconds() + seconds);
      player.setOnline(false);
      playerRepository.save(player);
    }
  }

  private Player findOrCreate(IncomingEventDto event) {
    if (event.uuid() != null) {
      return playerRepository.findById(event.uuid())
          .orElseGet(() -> newPlayer(event.uuid(), event));
    }

    return playerRepository.findByNameIgnoreCase(event.name())
        .orElseGet(() -> newPlayer(UUID.randomUUID(), event));
  }

  private Player newPlayer(UUID uuid, IncomingEventDto event) {
    Player player = new Player();
    player.setUuid(uuid);
    player.setName(event.name());
    player.setFirstSeen(event.at());
    return player;
  }

  private Player findPlayer(IncomingEventDto event) {
    if (event.uuid() != null) {
      return playerRepository.findById(event.uuid()).orElse(null);
    }
    if (event.name() != null) {
      return playerRepository.findByNameIgnoreCase(event.name()).orElse(null);
    }
    return null;
  }

  private GameEvent saveEvent(IncomingEventDto event, Player player) {
    GameEvent gameEvent = new GameEvent();
    gameEvent.setType(event.type());
    gameEvent.setPlayer(player);
    gameEvent.setMessage(event.message());
    gameEvent.setRawLine(event.rawLine());
    gameEvent.setX(event.x());
    gameEvent.setY(event.y());
    gameEvent.setZ(event.z());
    gameEvent.setCreatedAt(event.at());
    return gameEventRepository.save(gameEvent);
  }
}
