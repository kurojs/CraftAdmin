import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { apiClient } from "../api/client";
import { apiErrorMessage } from "../utils/errors";
import type { ActionResponse } from "../api/types";

interface ConsoleEntry {
  command: string;
  response: string;
  ok: boolean;
}

export default function Console() {
  const { user } = useAuth();
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<ConsoleEntry[]>([]);

  if (user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  async function send() {
    const value = command.trim();
    if (!value) return;

    try {
      const res = await apiClient.post<ActionResponse>("/actions/raw", {
        command: value,
      });
      setHistory((prev) => [
        { command: value, response: res.data.response, ok: res.data.success },
        ...prev,
      ]);
    } catch (error) {
      setHistory((prev) => [
        {
          command: value,
          response: apiErrorMessage(error, "Error sending the command"),
          ok: false,
        },
        ...prev,
      ]);
    } finally {
      setCommand("");
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Console</h1>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Enter a command..."
          className="flex-1 rounded border px-3 py-2 font-mono"
        />
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Send
        </button>
      </form>
      <div className="overflow-hidden rounded border bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th className="p-2">Command</th>
              <th className="p-2">Response</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 && (
              <tr>
                <td className="p-2 text-gray-500" colSpan={3}>
                  No commands sent yet.
                </td>
              </tr>
            )}
            {history.map((entry, index) => (
              <tr key={index} className="border-t">
                <td className="p-2 font-mono">{entry.command}</td>
                <td className="p-2">
                  <pre className="whitespace-pre-wrap text-sm">
                    {entry.response}
                  </pre>
                </td>
                <td
                  className={`p-2 ${entry.ok ? "text-green-600" : "text-red-600"}`}
                >
                  {entry.ok ? "OK" : "Failed"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
