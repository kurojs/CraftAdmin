package com.kuro.craft.controller;

import java.util.UUID;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.kuro.craft.dto.EventDto;
import com.kuro.craft.dto.PageDto;
import com.kuro.craft.model.EventType;
import com.kuro.craft.service.EventBroadcaster;
import com.kuro.craft.service.EventService;

@RestController
@RequestMapping("/api/events")
public class EventController {

  private final EventService eventService;
  private final EventBroadcaster eventBroadcaster;

  public EventController(EventService eventService, EventBroadcaster eventBroadcaster) {
    this.eventService = eventService;
    this.eventBroadcaster = eventBroadcaster;
  }

  @GetMapping
  public PageDto<EventDto> list(
      @RequestParam(required = false) EventType type,
      @RequestParam(required = false) UUID playerUuid,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size) {
    return eventService.list(type, playerUuid, page, size);
  }

  @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
  public SseEmitter stream() {
    return eventBroadcaster.subscribe();
  }
}
