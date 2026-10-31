package com.kuro.craft.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kuro.craft.dto.ActionResponse;
import com.kuro.craft.dto.KickBanRequest;
import com.kuro.craft.dto.PardonRequest;
import com.kuro.craft.dto.RawRequest;
import com.kuro.craft.dto.SayRequest;
import com.kuro.craft.dto.WhitelistRequest;
import com.kuro.craft.service.ActionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/actions")
public class ActionController {

  private final ActionService actionService;

  public ActionController(ActionService actionService) {
    this.actionService = actionService;
  }

  @PostMapping("/kick")
  public ActionResponse kick(@Valid @RequestBody KickBanRequest request, Authentication auth) {
    return actionService.kick(auth.getName(), request);
  }

  @PostMapping("/ban")
  public ActionResponse ban(@Valid @RequestBody KickBanRequest request, Authentication auth) {
    return actionService.ban(auth.getName(), request);
  }

  @PostMapping("/pardon")
  public ActionResponse pardon(@Valid @RequestBody PardonRequest request, Authentication auth) {
    return actionService.pardon(auth.getName(), request);
  }

  @PostMapping("/whitelist")
  public ActionResponse whitelist(@Valid @RequestBody WhitelistRequest request, Authentication auth) {
    return actionService.whitelist(auth.getName(), request);
  }

  @PostMapping("/say")
  public ActionResponse say(@Valid @RequestBody SayRequest request, Authentication auth) {
    return actionService.say(auth.getName(), request);
  }

  @PostMapping("/raw")
  public ActionResponse raw(@Valid @RequestBody RawRequest request, Authentication auth) {
    return actionService.raw(auth.getName(), request);
  }
}
