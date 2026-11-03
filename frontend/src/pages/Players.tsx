import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            update({ q: search, page: "0" });
          }}
        >
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name"
            className="rounded border px-3 py-2"
          />
          <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Search
          </button>
        </form>

        <select
          value={online ?? "all"}
          onChange={(e) =>
            update({
              online: e.target.value === "all" ? null : e.target.value,
              page: "0",
            })
          }
          className="rounded border px-3 py-2"
        >
          <option value="all">All players</option>
          <option value="true">Online</option>
          <option value="false">Offline</option>
        </select>

        <select
          value={sort}
          onChange={(e) => update({ sort: e.target.value, page: "0" })}
          className="rounded border px-3 py-2"
        >
          {SORTS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-600">Could not load the players.</p>}

      <table className="w-full text-left text-sm">
        <thead>
          <tr>
            <th className="p-2">Player</th>
            <th className="p-2">Status</th>
            <th className="p-2">Last seen</th>
            <th className="p-2">Playtime</th>
            <th className="p-2">Banned</th>
          </tr>
        </thead>
        <tbody>
          {data?.content.map((p) => (
            <tr
              key={p.uuid}
              className="cursor-pointer border-t hover:bg-gray-50"
              onClick={() => navigate("/players/" + p.uuid)}
            >
              <td className="p-2">
                <div className="flex items-center gap-2">
                  <PlayerAvatar name={p.name} />
                  {p.name}
                </div>
              </td>
              <td className="p-2">
                <span className={p.online ? "text-green-600" : "text-gray-400"}>
                  {p.online ? "Online" : "Offline"}
                </span>
              </td>
              <td className="p-2">{timeAgo(p.lastSeen)}</td>
              <td className="p-2">{formatDuration(p.totalPlaytimeSeconds)}</td>
              <td className="p-2">
                {p.banned && <span className="text-red-600">Banned</span>}
              </td>
            </tr>
          ))}
          {data && data.content.length === 0 && (
            <tr>
              <td className="p-2 text-gray-500" colSpan={5}>
                No players match the filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex items-center justify-between">
        <button
          className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
          onClick={() => update({ page: String(Math.max(page - 1, 0)) })}
          disabled={page === 0}
        >
          Previous
        </button>
        <span>
          Page {page + 1}
          {data ? ` of ${Math.max(Math.ceil(data.totalElements / data.size), 1)}` : ""}
        </span>
        <button
          className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
          onClick={() => update({ page: String(page + 1) })}
          disabled={!hasNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}
