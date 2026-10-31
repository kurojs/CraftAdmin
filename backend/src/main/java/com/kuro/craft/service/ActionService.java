package com.kuro.craft.service;

import org.springframework.stereotype.Service;

import com.kuro.craft.dto.ActionResponse;
import com.kuro.craft.dto.KickBanRequest;
import com.kuro.craft.dto.PardonRequest;
import com.kuro.craft.dto.RawRequest;
import com.kuro.craft.dto.SayRequest;
import com.kuro.craft.dto.WhitelistRequest;
import com.kuro.craft.model.Player;
import com.kuro.craft.repository.PlayerRepository;

@Service
public class ActionService {

  private final BridgeClient bridgeClient;
  private final AuditService auditService;
  private final PlayerRepository playerRepository;

  public ActionService(BridgeClient bridgeClient, AuditService auditService, PlayerRepository playerRepository) {
    this.bridgeClient = bridgeClient;
    this.auditService = auditService;
    this.playerRepository = playerRepository;
  }

  public ActionResponse kick(String admin, KickBanRequest request) {
    return execute(admin, "KICK", request.name(), withOptionalReason("kick", request.name(), request.reason()));
  }

  public ActionResponse ban(String admin, KickBanRequest request) {
    ActionResponse response = execute(admin, "BAN", request.name(),
        withOptionalReason("ban", request.name(), request.reason()));
    if (response.success()) {
      setBanned(request.name(), true);
    }
    return response;
  }

  public ActionResponse pardon(String admin, PardonRequest request) {
    ActionResponse response = execute(admin, "PARDON", request.name(), "pardon " + request.name());
    if (response.success()) {
      setBanned(request.name(), false);
    }
    return response;
  }

  public ActionResponse whitelist(String admin, WhitelistRequest request) {
    String command = "whitelist " + (request.add() ? "add" : "remove") + " " + request.name();
    return execute(admin, "WHITELIST", request.name(), command);
  }

  public ActionResponse say(String admin, SayRequest request) {
    return execute(admin, "SAY", null, "say " + request.message());
  }

  public ActionResponse raw(String admin, RawRequest request) {
    String command = request.command();
    String lower = command.toLowerCase();

    if (lower.startsWith("stop") || lower.startsWith("op") || lower.startsWith("deop")
        || lower.startsWith("whitelist off")) {
      throw new IllegalArgumentException("Command not allowed");
    }

    return execute(admin, "RAW", null, command);
  }

  private ActionResponse execute(String admin, String action, String target, String command) {
    BridgeClient.CommandResult result = bridgeClient.run(command);

    boolean success = result.ok()
        && !result.response().contains("No player was found")
        && !result.response().contains("Nothing changed");

    auditService.log(admin, action, target, result.response(), success);
    return new ActionResponse(success, result.response());
  }

  private String withOptionalReason(String base, String name, String reason) {
    if (reason == null || reason.isBlank()) {
      return base + " " + name;
    }
    return base + " " + name + " " + reason;
  }

  private void setBanned(String name, boolean banned) {
    playerRepository.findByNameIgnoreCase(name).ifPresent(player -> {
      Player target = player;
      target.setBanned(banned);
      playerRepository.save(target);
    });
  }
}
