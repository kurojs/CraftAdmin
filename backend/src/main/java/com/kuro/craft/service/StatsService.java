package com.kuro.craft.service;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kuro.craft.dto.DayActivityDto;
import com.kuro.craft.model.PlaySession;
import com.kuro.craft.repository.PlaySessionRepository;

@Service
@Transactional(readOnly = true)
public class StatsService {

  private static final int DAYS = 14;

  private final PlaySessionRepository playSessionRepository;

  public StatsService(PlaySessionRepository playSessionRepository) {
    this.playSessionRepository = playSessionRepository;
  }

  public List<DayActivityDto> activity() {
    ZoneId zone = ZoneId.systemDefault();
    LocalDate today = LocalDate.now(zone);
    LocalDate start = today.minusDays(DAYS - 1);
    Instant since = start.atStartOfDay(zone).toInstant();

    List<PlaySession> sessions = playSessionRepository.findByJoinedAtAfter(since);

    Map<LocalDate, List<PlaySession>> byDay = sessions.stream()
        .filter(session -> session.getJoinedAt() != null)
        .collect(Collectors.groupingBy(session -> session.getJoinedAt().atZone(zone).toLocalDate()));

    List<DayActivityDto> result = new ArrayList<>();
    for (int i = 0; i < DAYS; i++) {
      LocalDate date = start.plusDays(i);
      List<PlaySession> daySessions = byDay.getOrDefault(date, List.of());

      int uniquePlayers = (int) daySessions.stream()
          .filter(session -> session.getPlayer() != null)
          .map(session -> session.getPlayer().getUuid())
          .distinct()
          .count();

      double hoursPlayed = daySessions.stream()
          .mapToLong(this::durationSeconds)
          .sum() / 3600.0;

      result.add(new DayActivityDto(date, uniquePlayers, hoursPlayed));
    }

    return result;
  }

  private long durationSeconds(PlaySession session) {
    if (session.getDurationSeconds() != null) {
      return session.getDurationSeconds();
    }
    if (session.getJoinedAt() != null) {
      return Math.max(0, Duration.between(session.getJoinedAt(), Instant.now()).getSeconds());
    }
    return 0;
  }
}
