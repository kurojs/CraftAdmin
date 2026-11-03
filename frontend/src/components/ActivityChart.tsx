import { useQuery } from "@tanstack/react-query";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { apiClient } from "../api/client";
import type { DayActivity } from "../api/types";

export default function ActivityChart() {
  const { data } = useQuery({
    queryKey: ["activity"],
    queryFn: async () => (await apiClient.get<DayActivity[]>("/stats/activity")).data,
  });

  return (
    <div className="h-72 rounded-lg border p-4">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data ?? []}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="hoursPlayed" name="Hours played" />
          <Line dataKey="uniquePlayers" name="Unique players" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
