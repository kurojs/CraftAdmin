import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Send } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { apiClient } from "../api/client";
import { apiErrorMessage } from "../utils/errors";
import type { ActionResponse } from "../api/types";

interface ConsoleEntry {
  command: string;
  response: string;
  ok: boolean;
}

const QUICK_COMMANDS = [
  "list",
  "time set day",
  "weather clear",
  "save-all",
  "say Server restart in 5 minutes",
];

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
    <div className="mc-stack">
      <header className="mc-page-head">
        <h1 className="mc-page-title">Console</h1>
        <p className="mc-page-sub">
          Run raw commands on the Minecraft server through the bridge (RCON).
        </p>
      </header>

      <section className="mc-panel">
        <div className="mc-panel-head">
          <h2 className="mc-panel-title">Command line</h2>
          <span className="mc-badge mc-badge-danger">Admin only</span>
        </div>

        <form
          className="flex flex-col gap-2 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            send();
          }}
        >
          <input
            type="text"
            value={command}
            onChange={(event) => setCommand(event.target.value)}
            placeholder="Enter a command..."
            aria-label="Server command"
            className="mc-input min-w-0 flex-1 font-mono"
          />
          <button type="submit" className="mc-btn mc-btn-primary">
            <Send aria-hidden="true" />
            Send
          </button>
        </form>

        <div className="mt-3 flex flex-wrap items-center gap-1">
          <span className="mc-label mc-label-inline mr-1">Quick:</span>
          {QUICK_COMMANDS.map((quick) => (
            <button
              key={quick}
              type="button"
              className="mc-btn mc-btn-sm"
              onClick={() => setCommand(quick)}
            >
              {quick}
            </button>
          ))}
        </div>
      </section>

      <section className="mc-panel">
        <div className="mc-panel-head">
          <h2 className="mc-panel-title">Output</h2>
          <span className="mc-label mc-label-inline">
            {history.length} {history.length === 1 ? "command" : "commands"}
          </span>
        </div>

        <div className="mc-console">
          <div className="mc-console-head">
            <span className="mc-dot" aria-hidden="true" />
            server@craftadmin · rcon
          </div>
          <div className="mc-console-log" role="log" aria-live="polite">
            {history.length === 0 && (
              <p className="mc-hint">
                No commands sent yet. Try &quot;list&quot;.
              </p>
            )}
            {history.map((entry, index) => (
              <div key={index}>
                <p className="mc-console-cmd">{entry.command}</p>
                <pre
                  className={
                    "mc-console-out " +
                    (entry.ok ? "mc-console-ok" : "mc-console-fail")
                  }
                >
                  {entry.response}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
