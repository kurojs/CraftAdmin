import { Navigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Audit</h1>
      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-600">Could not load the audit log.</p>}
      <table className="w-full text-left text-sm">
        <thead>
          <tr>
            <th className="p-2">Date</th>
            <th className="p-2">Admin</th>
            <th className="p-2">Action</th>
            <th className="p-2">Target</th>
            <th className="p-2">Result</th>
            <th className="p-2">Detail</th>
          </tr>
        </thead>
        <tbody>
          {data?.content.map((entry) => (
            <tr key={entry.id} className="border-t">
              <td className="p-2">
                {new Date(entry.createdAt).toLocaleString()}
              </td>
              <td className="p-2">{entry.adminUsername ?? "-"}</td>
              <td className="p-2">{entry.action}</td>
              <td className="p-2">{entry.target ?? "-"}</td>
              <td
                className={`p-2 ${entry.success ? "text-green-600" : "text-red-600"}`}
              >
                {entry.success ? "OK" : "Failed"}
              </td>
              <td className="p-2">{entry.detail ?? ""}</td>
            </tr>
          ))}
          {data && data.content.length === 0 && (
            <tr>
              <td className="p-2 text-gray-500" colSpan={6}>
                No actions recorded.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex items-center justify-between">
        <button
          className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 0}
        >
          Previous
        </button>
        <span>Page {page + 1}</span>
        <button
          className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
          onClick={() => handlePageChange(page + 1)}
          disabled={!hasNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}
