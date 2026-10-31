package com.kuro.craft.service;

import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.kuro.craft.dto.EventDto;

@Service
public class EventBroadcaster {

  private final CopyOnWriteArrayList<SseEmitter> emitters = new CopyOnWriteArrayList<>();

  public SseEmitter subscribe() {
    SseEmitter emitter = new SseEmitter(0L);
    emitters.add(emitter);
    emitter.onCompletion(() -> emitters.remove(emitter));
    emitter.onTimeout(() -> emitters.remove(emitter));
    emitter.onError(error -> emitters.remove(emitter));
    return emitter;
  }

  public void broadcast(EventDto event) {
    for (SseEmitter emitter : emitters) {
      try {
        emitter.send(SseEmitter.event().name("game-event").data(event));
      } catch (Exception ex) {
        emitters.remove(emitter);
      }
    }
  }

  @Scheduled(fixedRate = 20000)
  public void heartbeat() {
    for (SseEmitter emitter : emitters) {
      try {
        emitter.send(SseEmitter.event().comment("ping"));
      } catch (Exception ex) {
        emitters.remove(emitter);
      }
    }
  }
}
