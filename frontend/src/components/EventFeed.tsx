import type { GameEvent } from "../api/types";
import PlayerAvatar from "./PlayerAvatar";
import { timeAgo } from "../utils/format";

export default function EventFeed({ events }: { events: GameEvent[] }) {
  if (events.length === 0) {
    return <p className="text-gray-500">No events yet.</p>;
  }

  return (
    <ul className="space-y-1">
      {events.map((e) => (
        <li key={e.id} className="flex items-center gap-2 text-sm">
          {e.playerName && <PlayerAvatar name={e.playerName} size={20} />}
          <b>{e.playerName ?? "Server"}</b>

          <span className="text-gray-500">
            {e.message ?? e.type} - {timeAgo(e.createdAt)}
          </span>
        </li>
      ))}
    </ul>
  );
}
