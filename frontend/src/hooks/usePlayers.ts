import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import type { Page, Player } from "../api/types";

export interface FilterPlayersParams {
  query?: string;
  online?: boolean;
  page?: number;
  sort?: string;
}

export function usePlayers(params: FilterPlayersParams) {
  return useQuery({
    queryKey: ["players", params],
    queryFn: async () => {
      const searchParams: Record<string, string | number | boolean> = {
        page: params.page ?? 0,
        size: 20,
        sort: params.sort ?? "name",
      };

      if (params.query) {
        searchParams.q = params.query;
      }

      if (params.online !== undefined) {
        searchParams.online = params.online;
      }

      const res = await apiClient.get<Page<Player>>("/players", {
        params: searchParams,
      });
      return res.data;
    },
  });
}
