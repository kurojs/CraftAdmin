import { useOnlinePlayers } from "../hooks/useOnlinePlayers";
import { useRecentEvents } from "../hooks/useRecentEvents";
import { useServerStatus } from "../hooks/useServerStatus";
import { useLiveEvents } from "../hooks/useLiveEvents";
import PlayerAvatar from "../components/PlayerAvatar";
import ActivityChart from "../components/ActivityChart";
import EventFeed from "../components/EventFeed";

export default function Dashboard() {
  const statusQuery = useServerStatus();
  const onlinePlayersQuery = useOnlinePlayers();
  const eventsQuery = useRecentEvents();
  const liveEvents = useLiveEvents();

  const status = statusQuery.data;
  const events = liveEvents.length > 0 ? liveEvents : (eventsQuery.data ?? []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <section className="rounded-lg border bg-white p-4">
        <h2 className="mb-3 text-xl font-semibold">Server status</h2>
        {statusQuery.isLoading && <p>Loading...</p>}
        {statusQuery.isError && (
          <p className="text-red-600">Could not load the server status.</p>
        )}
        {status && (
          <dl className="grid gap-4 text-sm md:grid-cols-4">
            <div>
              <dt className="text-gray-500">State</dt>
              <dd className={status.online ? "text-green-600" : "text-red-600"}>
                {status.online ? "Online" : "Offline"}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Version</dt>
              <dd>{status.version || "-"}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Players</dt>
              <dd>
                {status.playersOnline} / {status.playersMax}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Latency</dt>
              <dd>{status.latencyMs} ms</dd>
            </div>
          </dl>
        )}
      </section>

      <section className="rounded-lg border bg-white p-4">
        <h2 className="mb-3 text-xl font-semibold">Online players</h2>
        {onlinePlayersQuery.isLoading && <p>Loading...</p>}
        {onlinePlayersQuery.isError && (
          <p className="text-red-600">Could not load the online players.</p>
        )}
        {onlinePlayersQuery.data && onlinePlayersQuery.data.length === 0 && (
          <p className="text-gray-500">Nobody is playing right now.</p>
        )}
        <div className="flex flex-wrap gap-2">
          {onlinePlayersQuery.data?.map((p) => (
            <div
              key={p.uuid}
              className="flex items-center gap-2 rounded border px-3 py-2"
            >
              <PlayerAvatar name={p.name} />
              <span>{p.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border bg-white p-4">
        <h2 className="mb-3 text-xl font-semibold">Activity</h2>
        {eventsQuery.isLoading && liveEvents.length === 0 && <p>Loading...</p>}
        {eventsQuery.isError && liveEvents.length === 0 && (
          <p className="text-red-600">Could not load the recent events.</p>
        )}
        <EventFeed events={events} />
      </section>

      <section className="rounded-lg border bg-white p-4">
        <h2 className="mb-3 text-xl font-semibold">Last 7 days</h2>
        <ActivityChart />
      </section>
    </div>
  );
}
