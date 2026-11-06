import type { Event } from "../api/types";

const EVENT_CLASS: Record<Event, string> = {
  JOIN: "mc-event-join",
  LEAVE: "mc-event-leave",
  DEATH: "mc-event-death",
  CHAT: "mc-event-chat",
  ADVANCEMENT: "mc-event-advancement",
  SERVER_START: "mc-event-server",
  SERVER_STOP: "mc-event-server",
};

export function eventClass(type: string): string {
  return EVENT_CLASS[type as Event] ?? "mc-event-server";
}
