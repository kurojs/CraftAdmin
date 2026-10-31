package com.kuro.craft.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.kuro.craft.model.PlaySession;
import com.kuro.craft.model.Player;

public interface PlaySessionRepository extends JpaRepository<PlaySession, Long> {

  Optional<PlaySession> findFirstByPlayerAndLeftAtIsNullOrderByJoinedAtDesc(Player player);

  List<PlaySession> findByLeftAtIsNull();

  Page<PlaySession> findByPlayerOrderByJoinedAtDesc(Player player, Pageable pageable);

}
