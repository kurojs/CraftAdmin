import { Navigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { apiClient } from "../api/client";
import type { AuditEntry, Page } from "../api/types";

export default function Audit() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const page = Number(params.get("page") ?? "0");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["audit", page],
    queryFn: async () => {
      const res = await apiClient.get<Page<AuditEntry>>("/audit", {
        params: { page, size: 20 },
      });
      return res.data;
    },
    enabled: user?.role === "ADMIN",
  });

  if (user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  function handlePageChange(newPage: number) {
    setParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", String(newPage));
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
        <h1 className="mc-page-title">Audit</h1>
        <p className="mc-page-sub">
          Every moderation action executed from this panel.
        </p>
      </header>

      <section className="mc-panel">
        <div className="mc-panel-head">
          <h2 className="mc-panel-title">Action log</h2>
          <span className="mc-badge mc-badge-plum">
            {data ? `${data.totalElements} entries` : "Loading"}
          </span>
        </div>

        {isLoading && <p className="mc-note">Loading...</p>}
        {isError && (
          <p className="mc-error">Could not load the audit log.</p>
        )}

        <div className="mc-table-wrap">
          <table className="mc-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Admin</th>
                <th>Action</th>
                <th>Target</th>
                <th>Result</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              {data?.content.map((entry) => (
                <tr key={entry.id}>
                  <td className="whitespace-nowrap text-mc-muted">
                    {new Date(entry.createdAt).toLocaleString()}
                  </td>
                  <td>{entry.adminUsername ?? "-"}</td>
                  <td>
                    <span className="mc-badge mc-badge-lapis">
                      {entry.action}
                    </span>
                  </td>
                  <td>{entry.target ?? "-"}</td>
                  <td>
                    <span
                      className={
                        "mc-badge " +
                        (entry.success
                          ? "mc-badge-online"
                          : "mc-badge-danger")
                      }
                    >
                      {entry.success ? "OK" : "Failed"}
                    </span>
                  </td>
                  <td className="text-mc-muted">{entry.detail ?? ""}</td>
                </tr>
              ))}
              {data && data.content.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <p className="mc-empty">No actions recorded.</p>
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
