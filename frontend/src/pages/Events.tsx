import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { apiClient } from "../api/client";
import type { Page, GameEvent } from "../api/types";
import PlayerAvatar from "../components/PlayerAvatar";
import { timeAgo } from "../utils/format";

const COLORS: Record<string, string> = {
  JOIN: "bg-green-600",
  LEAVE: "bg-yellow-600",
  DEATH: "bg-red-600",
  CHAT: "bg-blue-600",
  ADVANCEMENT: "bg-purple-600",
  SERVER_START: "bg-gray-600",
  SERVER_STOP: "bg-gray-600",
};

export default function Events() {
  const [params, setParams] = useSearchParams();
  const type = params.get("type") ?? "";
  const page = Number(params.get("page") ?? "0");

  const { data } = useQuery({
    queryKey: ["events", { type, page }],
    queryFn: async () => {
      const res = await apiClient.get<Page<GameEvent>>("/events", {
        params: {
          type: type || undefined,
          page,
          size: 20,
        },
      });
      return res.data;
    },
  });

  function handleTypeChange(newType: string) {
    setParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (newType) {
        newParams.set("type", newType);
      } else {
        newParams.delete("type");
      }
      newParams.set("page", "0");
      return newParams;
    });
  }

  function handlePageChange(newPage: number) {
    setParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", String(newPage));
      return newParams;
    });
  }

  const hasNext =
    data &&
    (data.page + 1) * data.size < data.totalElements;

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <button
          className={`px-4 py-2 rounded ${
            type === "" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => handleTypeChange("")}
        >
          All
        </button>
        {Object.keys(COLORS).map((eventType) => (
          <button
            key={eventType}
            className={`px-4 py-2 rounded ${
              type === eventType ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => handleTypeChange(eventType)}
          >
            {eventType}
          </button>
        ))}
      </div>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="p-2">Event Type</th>
            <th className="p-2">Player</th>
            <th className="p-2">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {data?.content.map((event) => (
            <tr key={event.id} className="border-t">
              <td className={`p-2 ${COLORS[event.type] ?? "bg-gray-200"}`}>
                {event.type}
              </td>
              <td className="p-2 flex items-center gap-2">
                {event.playerName && <PlayerAvatar name={event.playerName} />}
                {event.playerName ?? "N/A"}
              </td>
              <td className="p-2">{timeAgo(event.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-between">
        <button
          className="px-4 py-2 bg-gray-200 rounded"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 0}
        >
          Previous
        </button>
        <span>Page {page + 1}</span>
        <button
          className="px-4 py-2 bg-gray-200 rounded"
          onClick={() => handlePageChange(page + 1)}
          disabled={!hasNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}
