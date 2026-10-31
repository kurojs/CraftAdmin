package com.kuro.craft.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kuro.craft.service.SkinService;

@RestController
@RequestMapping("/api/players")
public class SkinController {

  private final SkinService skinService;

  public SkinController(SkinService skinService) {
    this.skinService = skinService;
  }

  @GetMapping("/{name}/skin")
  public ResponseEntity<byte[]> skin(@PathVariable String name) {
    return ResponseEntity.ok()
        .contentType(MediaType.IMAGE_PNG)
        .body(skinService.getSkin(name));
  }
}
