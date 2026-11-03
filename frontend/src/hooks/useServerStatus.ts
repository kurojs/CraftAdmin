import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import type { ServerStatus } from "../api/types";

export function useServerStatus() {
  return useQuery({
    queryKey: ["serverStatus"],
    queryFn: async () =>
      (await apiClient.get<ServerStatus>("/server/status")).data,
    refetchInterval: 5000,
  });
}
