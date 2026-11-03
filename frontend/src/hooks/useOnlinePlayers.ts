import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import type { Page, Player } from "../api/types";

export function useOnlinePlayers() {
  return useQuery({
    queryKey: ["onlinePlayers"],
    queryFn: async () => {
      const res = await apiClient.get<Page<Player>>("/players", {
        params: { online: true, size: 50 },
      });
      return res.data.content;
    },
    refetchInterval: 5000,
  });
}
