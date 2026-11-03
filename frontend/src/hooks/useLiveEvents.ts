import { useEffect, useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useQueryClient } from "@tanstack/react-query";
import type { GameEvent } from "../api/types";

export function useLiveEvents() {
  const [events, setEvents] = useState<GameEvent[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    const ctrl = new AbortController();

    fetchEventSource("/api/events/stream", {
      signal: ctrl.signal,
      headers: { Authorization: "Bearer " + sessionStorage.getItem("token") },
      openWhenHidden: true,
      onmessage(msg) {
        if (msg.event !== "game-event") return;
        const event = JSON.parse(msg.data) as GameEvent;
        setEvents((prev) => [event, ...prev].slice(0, 100));
        queryClient.invalidateQueries({ queryKey: ["players"] });
        queryClient.invalidateQueries({ queryKey: ["onlinePlayers"] });
        queryClient.invalidateQueries({ queryKey: ["recentEvents"] });
        queryClient.invalidateQueries({ queryKey: ["serverStatus"] });
      },
      onerror(error) {
        const status = (error as { status?: number }).status;
        if (status === 401 || status === 403) {
          throw error;
        }
        return 3000;
      },
    }).catch(() => undefined);

    return () => ctrl.abort();
  }, [queryClient]);

  return events;
}
