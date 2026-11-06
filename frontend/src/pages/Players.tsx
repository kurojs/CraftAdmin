import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { usePlayers } from "../hooks/usePlayers";
import PlayerAvatar from "../components/PlayerAvatar";
import { formatDuration, timeAgo } from "../utils/format";

const SORTS = [
  { value: "name", label: "Name" },
  { value: "lastSeen", label: "Last seen" },
  { value: "totalPlaytimeSeconds", label: "Playtime" },
];

export default function Players() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get("q") ?? "");

  const query = params.get("q") ?? "";
  const online = params.get("online");
  const sort = params.get("sort") ?? "name";
  const page = Number(params.get("page") ?? "0");

  const { data, isLoading, isError } = usePlayers({
    query,
    online: online === null ? undefined : online === "true",
    sort,
    page,
  });

  function update(next: Record<string, string | null>) {
    setParams((prev) => {
      const newParams = new URLSearchParams(prev);
      for (const [key, value] of Object.entries(next)) {
        if (value === null || value === "") {
          newParams.delete(key);
        } else {
          newParams.set(key, value);
        }
      }
      return newParams;
    });
  }

  const hasNext = data ? (page + 1) * data.size < data.totalElements : false;
  const totalPages = data
    ? Math.max(Math.ceil(data.totalElements / data.size), 1)
    : 1;

  return (
    <div className="mc-stack">
      <header className="mc-page-head">
        <h1 className="mc-page-title">Players</h1>
        <p className="mc-page-sub">
          Everyone who has joined the server, with playtime and moderation
          state.
        </p>
      </header>

      <section className="mc-panel">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <form
            className="flex flex-1 items-end gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              update({ q: search, page: "0" });
            }}
          >
            <div className="min-w-0 flex-1">
              <label htmlFor="player-search" className="mc-label">
                Search
              </label>
              <input
                id="player-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name"
                className="mc-input"
              />
            </div>
            <button type="submit" className="mc-btn mc-btn-primary">
              <Search aria-hidden="true" />
              Search
            </button>
          </form>

          <div className="w-full sm:w-44">
            <label htmlFor="player-status" className="mc-label">
              Status
            </label>
            <select
              id="player-status"
              value={online ?? "all"}
              onChange={(event) =>
                update({
                  online:
                    event.target.value === "all" ? null : event.target.value,
                  page: "0",
                })
              }
              className="mc-select"
            >
              <option value="all">All players</option>
              <option value="true">Online</option>
              <option value="false">Offline</option>
            </select>
          </div>

          <div className="w-full sm:w-44">
            <label htmlFor="player-sort" className="mc-label">
              Sort by
            </label>
            <select
              id="player-sort"
              value={sort}
              onChange={(event) =>
                update({ sort: event.target.value, page: "0" })
              }
              className="mc-select"
            >
              {SORTS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="mc-panel">
        <div className="mc-panel-head">
          <h2 className="mc-panel-title">Player list</h2>
          <span className="mc-badge mc-badge-offline">
            {data ? `${data.totalElements} total` : "Loading"}
          </span>
        </div>

        {isLoading && <p className="mc-note">Loading...</p>}
        {isError && <p className="mc-error">Could not load the players.</p>}

        <div className="mc-table-wrap">
          <table className="mc-table">
            <thead>
              <tr>
                <th>Player</th>
                <th>Status</th>
                <th>Last seen</th>
                <th>Playtime</th>
                <th>Banned</th>
              </tr>
            </thead>
            <tbody>
              {data?.content.map((player) => (
                <tr
                  key={player.uuid}
                  className="mc-row-click"
                  onClick={() => navigate("/players/" + player.uuid)}
                >
                  <td>
                    <div className="flex items-center gap-2">
                      <PlayerAvatar name={player.name} size={28} />
                      <span className="font-semibold text-white">
                        {player.name}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={
                        "mc-badge " +
                        (player.online
                          ? "mc-badge-online"
                          : "mc-badge-offline")
                      }
                    >
                      {player.online ? "Online" : "Offline"}
                    </span>
                  </td>
                  <td className="text-mc-muted">{timeAgo(player.lastSeen)}</td>
                  <td>{formatDuration(player.totalPlaytimeSeconds)}</td>
                  <td>
                    {player.banned ? (
                      <span className="mc-badge mc-badge-danger">Banned</span>
                    ) : (
                      <span className="text-mc-muted">-</span>
                    )}
                  </td>
                </tr>
              ))}
              {data && data.content.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    <p className="mc-empty">No players match the filters.</p>
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
            onClick={() => update({ page: String(Math.max(page - 1, 0)) })}
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
            onClick={() => update({ page: String(page + 1) })}
            disabled={!hasNext}
          >
            Next
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
      </section>
    </div>
  );
}
