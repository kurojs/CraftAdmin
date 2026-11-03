import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import type { GameEvent, Page } from "../api/types";

export function useRecentEvents() {
  return useQuery({
    queryKey: ["recentEvents"],
    queryFn: async () => {
      const res = await apiClient.get<Page<GameEvent>>("/events", {
        params: { size: 10 },
      });
      return res.data.content;
    },
    refetchInterval: 5000,
  });
}
