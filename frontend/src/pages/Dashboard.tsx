import { Link } from "react-router-dom";
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
  const onlinePlayers = onlinePlayersQuery.data ?? [];

  const slotPercent =
    status && status.playersMax > 0
      ? Math.min(100, Math.round((status.playersOnline / status.playersMax) * 100))
      : 0;

  return (
    <div className="mc-stack">
      <header className="mc-page-head">
        <h1 className="mc-page-title">Dashboard</h1>
        <p className="mc-page-sub">
          Live overview of the server, its players and the latest events.
        </p>
      </header>

      <section className="mc-panel">
        <div className="mc-panel-head">
          <h2 className="mc-panel-title">Server status</h2>
          {status && (
            <span
              className={
                "mc-badge " +
                (status.online ? "mc-badge-online" : "mc-badge-offline")
              }
            >
              {status.online ? "Online" : "Offline"}
            </span>
          )}
        </div>

        {statusQuery.isLoading && <p className="mc-note">Loading status...</p>}
        {statusQuery.isError && (
          <p className="mc-error">Could not load the server status.</p>
        )}

        {status && (
          <>
            <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="mc-stat">
                <dt>State</dt>
                <dd
                  className={
                    status.online ? "text-mc-grass" : "text-mc-redstone"
                  }
                >
                  {status.online ? "Online" : "Offline"}
                </dd>
              </div>
              <div className="mc-stat">
                <dt>Version</dt>
                <dd>{status.version || "-"}</dd>
              </div>
              <div className="mc-stat">
                <dt>Players</dt>
                <dd>
                  {status.playersOnline} / {status.playersMax}
                </dd>
              </div>
              <div className="mc-stat">
                <dt>Latency</dt>
                <dd>{status.latencyMs} ms</dd>
              </div>
            </dl>

            <div className="mt-4">
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="mc-label mc-label-inline">Player slots</span>
                <span className="mc-page-count">{slotPercent}%</span>
              </div>
              <div className="mc-xpbar" role="presentation">
                <span style={{ width: `${slotPercent}%` }} />
              </div>
            </div>
          </>
        )}
      </section>

      <section className="mc-panel">
        <div className="mc-panel-head">
          <h2 className="mc-panel-title">Online players</h2>
          <span className="mc-badge mc-badge-gold">
            {onlinePlayers.length} online
          </span>
        </div>

        {onlinePlayersQuery.isLoading && <p className="mc-note">Loading...</p>}
        {onlinePlayersQuery.isError && (
          <p className="mc-error">Could not load the online players.</p>
        )}
        {onlinePlayersQuery.data && onlinePlayers.length === 0 && (
          <p className="mc-empty">Nobody is playing right now.</p>
        )}

        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {onlinePlayers.map((player) => (
            <Link
              key={player.uuid}
              to={`/players/${player.uuid}`}
              className="mc-player-chip"
            >
              <PlayerAvatar name={player.name} size={40} />
              <span className="min-w-0">
                <span className="block truncate font-semibold text-white">
                  {player.name}
                </span>
                <span className="mc-label mc-label-inline">Playing now</span>
              </span>
              <span className="mc-dot ml-auto" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="mc-panel">
          <div className="mc-panel-head">
            <h2 className="mc-panel-title">Live activity</h2>
            <span className="mc-badge mc-badge-diamond">Live</span>
          </div>
          {eventsQuery.isLoading && liveEvents.length === 0 && (
            <p className="mc-note">Loading...</p>
          )}
          {eventsQuery.isError && liveEvents.length === 0 && (
            <p className="mc-error">Could not load the recent events.</p>
          )}
          <EventFeed events={events} />
        </section>

        <section className="mc-panel">
          <div className="mc-panel-head">
            <h2 className="mc-panel-title">Last 14 days</h2>
            <span className="mc-label mc-label-inline">Hours / players</span>
          </div>
          <ActivityChart />
        </section>
      </div>
    </div>
  );
}
