package com.kuro.craft.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.kuro.craft.model.Player;

public interface PlayerRepository extends JpaRepository<Player, UUID> {

  Optional<Player> findByNameIgnoreCase(String name);

  Page<Player> findByNameContainingIgnoreCase(String q, Pageable pageable);

  Page<Player> findByOnline(boolean online, Pageable pageable);

  Page<Player> findByNameContainingIgnoreCaseAndOnline(String q, boolean online, Pageable pageable);

  List<Player> findByOnlineTrue();

}
