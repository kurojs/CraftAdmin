package com.kuro.craft.repository;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.kuro.craft.model.EventType;
import com.kuro.craft.model.GameEvent;

public interface GameEventRepository extends JpaRepository<GameEvent, Long> {

  Page<GameEvent> findAllByOrderByCreatedAtDesc(Pageable pageable);

  Page<GameEvent> findByTypeOrderByCreatedAtDesc(EventType type, Pageable pageable);

  Page<GameEvent> findByPlayerUuidOrderByCreatedAtDesc(UUID uuid, Pageable pageable);

  Page<GameEvent> findByTypeAndPlayerUuidOrderByCreatedAtDesc(EventType type, UUID uuid, Pageable pageable);

}
