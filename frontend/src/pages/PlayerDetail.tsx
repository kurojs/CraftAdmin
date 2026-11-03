import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import type { Page, Player, Session } from "../api/types";
import SkinViewer3D from "../components/SkinViewer3D";
import ActionButtons from "../components/ActionButtons";
import { formatDuration, timeAgo } from "../utils/format";

export default function PlayerDetail() {
  const { uuid } = useParams<{ uuid: string }>();
  const [page, setPage] = useState(0);

  const playerQuery = useQuery({
    queryKey: ["player", uuid],
    queryFn: async () => {
      const res = await apiClient.get<Player>(`/players/${uuid}`);
      return res.data;
    },
    enabled: !!uuid,
  });

  const sessionsQuery = useQuery({
    queryKey: ["sessions", uuid, page],
    queryFn: async () => {
      const res = await apiClient.get<Page<Session>>(
        `/players/${uuid}/sessions`,
        { params: { page, size: 10 } },
      );
      return res.data;
    },
    enabled: !!uuid,
  });

  if (playerQuery.isLoading) return <p>Loading...</p>;
  if (playerQuery.isError || !playerQuery.data) {
    return <p className="text-red-600">Could not load the player.</p>;
  }

  const player = playerQuery.data;
  const sessions = sessionsQuery.data;
  const hasNext = sessions ? (page + 1) * sessions.size < sessions.totalElements : false;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <h1 className="text-2xl font-bold">{player.name}</h1>
        <span
          className={`rounded px-2 py-1 text-sm ${
            player.online
              ? "bg-green-100 text-green-800"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {player.online ? "Online" : "Offline"}
        </span>
        {player.banned && (
          <span className="rounded bg-red-100 px-2 py-1 text-sm text-red-800">
            Banned
          </span>
        )}
      </div>

      <dl className="grid gap-4 text-sm md:grid-cols-4">
        <div>
          <dt className="text-gray-500">UUID</dt>
          <dd className="font-mono text-xs">{player.uuid}</dd>
        </div>
        <div>
          <dt className="text-gray-500">First seen</dt>
          <dd>{new Date(player.firstSeen).toLocaleString()}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Last seen</dt>
          <dd>
            {timeAgo(player.lastSeen)} ({new Date(player.lastSeen).toLocaleString()})
          </dd>
        </div>
        <div>
          <dt className="text-gray-500">Total playtime</dt>
          <dd>{formatDuration(player.totalPlaytimeSeconds)}</dd>
        </div>
      </dl>

      <ActionButtons name={player.name} banned={player.banned} />

      <SkinViewer3D name={player.name} />

      <div>
        <h2 className="mb-4 text-xl font-bold">Sessions</h2>
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th className="p-2">Start</th>
              <th className="p-2">End</th>
              <th className="p-2">Duration</th>
            </tr>
          </thead>
          <tbody>
            {sessions?.content.map((session) => (
              <tr key={session.id} className="border-t">
                <td className="p-2">
                  {new Date(session.joinedAt).toLocaleString()}
                </td>
                <td className="p-2">
                  {session.leftAt
                    ? new Date(session.leftAt).toLocaleString()
                    : "Ongoing"}
                </td>
                <td className="p-2">
                  {formatDuration(session.durationSeconds ?? 0)}
                </td>
              </tr>
            ))}
            {sessions && sessions.content.length === 0 && (
              <tr>
                <td className="p-2 text-gray-500" colSpan={3}>
                  No sessions recorded.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="mt-4 flex items-center justify-between">
          <button
            className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page === 0}
          >
            Previous
          </button>
          <span>Page {page + 1}</span>
          <button
            className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={!hasNext}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
