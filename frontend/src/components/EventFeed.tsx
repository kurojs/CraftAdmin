import type { GameEvent } from "../api/types";
import PlayerAvatar from "./PlayerAvatar";
import { timeAgo } from "../utils/format";
import { eventClass } from "../utils/eventStyles";

export default function EventFeed({ events }: { events: GameEvent[] }) {
  if (events.length === 0) {
    return <p className="mc-empty">No events yet.</p>;
  }

  return (
    <ul className="mc-chat">
      {events.map((event) => (
        <li key={event.id} className="mc-chat-line">
          <span className={"mc-event-tag " + eventClass(event.type)}>
            {event.type}
          </span>
          {event.playerName && (
            <PlayerAvatar name={event.playerName} size={20} />
          )}
          <span className="mc-chat-body">
            <b>{event.playerName ?? "Server"}</b>{" "}
            <span className="mc-chat-text">{event.message ?? event.type}</span>
          </span>
          <span className="mc-chat-time">{timeAgo(event.createdAt)}</span>
        </li>
      ))}
    </ul>
  );
}
