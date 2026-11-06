import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { apiClient } from "../api/client";
import type { Event, Page, GameEvent } from "../api/types";
import PlayerAvatar from "../components/PlayerAvatar";
import { timeAgo } from "../utils/format";
import { eventClass } from "../utils/eventStyles";

const EVENT_TYPES: Event[] = [
  "JOIN",
  "LEAVE",
  "DEATH",
  "CHAT",
  "ADVANCEMENT",
  "SERVER_START",
  "SERVER_STOP",
];

export default function Events() {
  const [params, setParams] = useSearchParams();
  const type = params.get("type") ?? "";
  const page = Number(params.get("page") ?? "0");

  const { data, isLoading, isError } = useQuery({
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

  const hasNext = data && (data.page + 1) * data.size < data.totalElements;
  const totalPages = data
    ? Math.max(Math.ceil(data.totalElements / data.size), 1)
    : 1;

  return (
    <div className="mc-stack">
      <header className="mc-page-head">
        <h1 className="mc-page-title">Events</h1>
        <p className="mc-page-sub">
          Every join, leave, death, chat message and advancement on the server.
        </p>
      </header>

      <section className="mc-panel">
        <div className="mc-panel-head">
          <h2 className="mc-panel-title">Filter by event</h2>
          <span className="mc-badge mc-badge-offline">
            {data ? `${data.totalElements} events` : "Loading"}
          </span>
        </div>

        <div className="flex flex-wrap gap-1">
          <button
            type="button"
            className={
              "mc-btn mc-btn-sm" + (type === "" ? " mc-btn-primary" : "")
            }
            onClick={() => handleTypeChange("")}
          >
            All
          </button>
          {EVENT_TYPES.map((eventType) => (
            <button
              key={eventType}
              type="button"
              className={
                "mc-btn mc-btn-sm" +
                (type === eventType ? " mc-btn-primary" : "")
              }
              onClick={() => handleTypeChange(eventType)}
            >
              {eventType}
            </button>
          ))}
        </div>
      </section>

      <section className="mc-panel">
        <div className="mc-panel-head">
          <h2 className="mc-panel-title">Event history</h2>
          <span className="mc-label mc-label-inline">Newest first</span>
        </div>

        {isLoading && <p className="mc-note">Loading...</p>}
        {isError && <p className="mc-error">Could not load the events.</p>}

        <div className="mc-table-wrap">
          <table className="mc-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Player</th>
                <th>Detail</th>
                <th>When</th>
              </tr>
            </thead>
            <tbody>
              {data?.content.map((event) => (
                <tr key={event.id}>
                  <td>
                    <span
                      className={"mc-event-tag " + eventClass(event.type)}
                    >
                      {event.type}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      {event.playerName && (
                        <PlayerAvatar name={event.playerName} size={24} />
                      )}
                      <span>{event.playerName ?? "N/A"}</span>
                    </div>
                  </td>
                  <td className="text-mc-muted">{event.message ?? "-"}</td>
                  <td className="text-mc-muted">
                    {timeAgo(event.createdAt)}
                  </td>
                </tr>
              ))}
              {data && data.content.length === 0 && (
                <tr>
                  <td colSpan={4}>
                    <p className="mc-empty">No events for this filter.</p>
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
            onClick={() => handlePageChange(page - 1)}
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
            onClick={() => handlePageChange(page + 1)}
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
