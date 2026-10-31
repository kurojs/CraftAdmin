package com.kuro.craft.service;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kuro.craft.dto.EventDto;
import com.kuro.craft.dto.PageDto;
import com.kuro.craft.model.EventType;
import com.kuro.craft.model.GameEvent;
import com.kuro.craft.repository.GameEventRepository;

@Service
@Transactional(readOnly = true)
public class EventService {

  private final GameEventRepository gameEventRepository;

  public EventService(GameEventRepository gameEventRepository) {
    this.gameEventRepository = gameEventRepository;
  }

  public PageDto<EventDto> list(EventType type, UUID playerUuid, int page, int size) {
    Pageable pageable = PageRequest.of(Math.max(page, 0), Math.max(1, Math.min(size, 100)));

    Page<GameEvent> result;
    if (type != null && playerUuid != null) {
      result = gameEventRepository.findByTypeAndPlayerUuidOrderByCreatedAtDesc(type, playerUuid, pageable);
    } else if (type != null) {
      result = gameEventRepository.findByTypeOrderByCreatedAtDesc(type, pageable);
    } else if (playerUuid != null) {
      result = gameEventRepository.findByPlayerUuidOrderByCreatedAtDesc(playerUuid, pageable);
    } else {
      result = gameEventRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    return PageDto.from(result.map(EventDto::from));
  }
}
