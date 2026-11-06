import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
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

  if (playerQuery.isLoading) return <p className="mc-note">Loading...</p>;
  if (playerQuery.isError || !playerQuery.data) {
    return <p className="mc-error">Could not load the player.</p>;
  }

  const player = playerQuery.data;
  const sessions = sessionsQuery.data;
  const hasNext = sessions
    ? (page + 1) * sessions.size < sessions.totalElements
    : false;
  const totalPages = sessions
    ? Math.max(Math.ceil(sessions.totalElements / sessions.size), 1)
    : 1;

  return (
    <div className="mc-stack">
      <div>
        <Link to="/players" className="mc-back">
          <ArrowLeft aria-hidden="true" />
          Back to players
        </Link>

        <header className="mc-page-head mt-2">
          <h1 className="mc-page-title">{player.name}</h1>
          <p className="mc-page-sub">
            Player profile, play sessions and moderation actions.
          </p>
        </header>

        <div className="mt-3 flex flex-wrap gap-2">
          <span
            className={
              "mc-badge " +
              (player.online ? "mc-badge-online" : "mc-badge-offline")
            }
          >
            {player.online ? "Online" : "Offline"}
          </span>
          {player.banned && (
            <span className="mc-badge mc-badge-danger">Banned</span>
          )}
        </div>
      </div>

      <section className="mc-panel">
        <div className="mc-panel-head">
          <h2 className="mc-panel-title">Profile</h2>
          <span className="mc-label mc-label-inline">
            {player.uuid.slice(0, 8)}
          </span>
        </div>

        <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="mc-stat">
            <dt>UUID</dt>
            <dd className="break-all font-mono text-xs">{player.uuid}</dd>
          </div>
          <div className="mc-stat">
            <dt>First seen</dt>
            <dd>{new Date(player.firstSeen).toLocaleString()}</dd>
          </div>
          <div className="mc-stat">
            <dt>Last seen</dt>
            <dd>
              {timeAgo(player.lastSeen)}
              <span className="mc-label mt-1">
                {new Date(player.lastSeen).toLocaleString()}
              </span>
            </dd>
          </div>
          <div className="mc-stat">
            <dt>Total playtime</dt>
            <dd>{formatDuration(player.totalPlaytimeSeconds)}</dd>
          </div>
        </dl>
      </section>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="mc-panel">
          <div className="mc-panel-head">
            <h2 className="mc-panel-title">Sessions</h2>
            <span className="mc-badge mc-badge-offline">
              {sessions ? `${sessions.totalElements} total` : "Loading"}
            </span>
          </div>

          {sessionsQuery.isError && (
            <p className="mc-error">Could not load the sessions.</p>
          )}

          <div className="mc-table-wrap">
            <table className="mc-table">
              <thead>
                <tr>
                  <th>Start</th>
                  <th>End</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {sessions?.content.map((session) => (
                  <tr key={session.id}>
                    <td>{new Date(session.joinedAt).toLocaleString()}</td>
                    <td>
                      {session.leftAt
                        ? new Date(session.leftAt).toLocaleString()
                        : "Ongoing"}
                    </td>
                    <td>
                      {formatDuration(session.durationSeconds ?? 0)}
                    </td>
                  </tr>
                ))}
                {sessions && sessions.content.length === 0 && (
                  <tr>
                    <td colSpan={3}>
                      <p className="mc-empty">No sessions recorded.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mc-pagination">
            <button
              type="button"
              className="mc-btn mc-btn-sm"
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              disabled={page === 0}
            >
              <ChevronLeft aria-hidden="true" />
              Previous
            </button>
            <span className="mc-page-count">
              Page {page + 1} of {totalPages}
            </span>
            <button
              type="button"
              className="mc-btn mc-btn-sm"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={!hasNext}
            >
              Next
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
        </section>

        <div className="flex flex-col gap-6">
          <section className="mc-panel">
            <div className="mc-panel-head">
              <h2 className="mc-panel-title">Skin</h2>
              <span className="mc-badge mc-badge-diamond">3D</span>
            </div>
            <SkinViewer3D name={player.name} />
          </section>

          <section className="mc-panel">
            <div className="mc-panel-head">
              <h2 className="mc-panel-title">Moderation</h2>
            </div>
            <ActionButtons name={player.name} banned={player.banned} />
          </section>
        </div>
      </div>
    </div>
  );
}
