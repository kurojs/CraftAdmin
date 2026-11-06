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

const pixelFont = "Monocraft, monospace";

function formatDay(value: string): string {
  const date =
    value.length === 10 ? new Date(value + "T00:00:00") : new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function ActivityChart() {
  const { data } = useQuery({
    queryKey: ["activity"],
    queryFn: async () =>
      (await apiClient.get<DayActivity[]>("/stats/activity")).data,
  });

  return (
    <div className="mc-chart">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data ?? []}
          margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
        >
          <XAxis
            dataKey="date"
            stroke="#4a4a4a"
            tick={{ fill: "#a4a4a4", fontSize: 10, fontFamily: pixelFont }}
            tickLine={false}
            axisLine={{ stroke: "#3a3a3a" }}
            tickFormatter={formatDay}
            minTickGap={28}
            tickMargin={6}
          />
          <YAxis
            stroke="#4a4a4a"
            tick={{ fill: "#a4a4a4", fontSize: 10, fontFamily: pixelFont }}
            tickLine={false}
            axisLine={false}
            width={52}
            tickFormatter={(value: number) => String(parseFloat(value.toFixed(2)))}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.06)" }}
            contentStyle={{
              background: "#141414",
              border: "2px solid #0b0b0b",
              borderRadius: 0,
              fontFamily: "Monocraft, monospace",
              fontSize: 13,
              color: "#ededed",
              boxShadow: "3px 3px 0 rgba(0,0,0,0.5)",
            }}
            labelStyle={{ color: "#f4c542", fontWeight: 700 }}
            itemStyle={{ color: "#ededed" }}
          />
          <Legend
            wrapperStyle={{
              fontFamily: pixelFont,
              fontSize: 9,
              color: "#d0d0d0",
            }}
          />
          <Bar
            dataKey="hoursPlayed"
            name="Hours played"
            fill="#5bbf2f"
            stroke="#2f6b18"
            strokeWidth={2}
            maxBarSize={26}
          />
          <Line
            dataKey="uniquePlayers"
            name="Unique players"
            stroke="#f4c542"
            strokeWidth={3}
            dot={{ r: 3, fill: "#f4c542", stroke: "#0b0b0b", strokeWidth: 2 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
