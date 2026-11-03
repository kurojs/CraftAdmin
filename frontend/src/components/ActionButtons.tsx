import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { useAuth } from "../hooks/useAuth";
import { apiErrorMessage } from "../utils/errors";
import type { ActionResponse } from "../api/types";

interface ActionButtonsProps {
  name: string;
  banned: boolean;
}

export default function ActionButtons({ name, banned }: ActionButtonsProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(
    null,
  );
  const [pending, setPending] = useState(false);

  if (user?.role !== "MODERATOR" && user?.role !== "ADMIN") return null;

  async function run(endpoint: string, body: object) {
    setPending(true);
    try {
      const res = await apiClient.post<ActionResponse>(
        `/actions/${endpoint}`,
        body,
      );
      setMessage({ ok: res.data.success, text: res.data.response });
      queryClient.invalidateQueries({ queryKey: ["players"] });
      queryClient.invalidateQueries({ queryKey: ["player"] });
      queryClient.invalidateQueries({ queryKey: ["audit"] });
    } catch (error) {
      setMessage({ ok: false, text: apiErrorMessage(error, "Failed to execute the action") });
    } finally {
      setPending(false);
    }
  }

  function kick() {
    if (!confirm(`Kick ${name}?`)) return;
    run("kick", { name });
  }

  function ban() {
    const reason = prompt(`Reason for banning ${name} (optional):`, "");
    if (reason === null) return;
    run("ban", { name, reason });
  }

  function pardon() {
    if (!confirm(`Unban ${name}?`)) return;
    run("pardon", { name });
  }

  function whitelist(add: boolean) {
    const verb = add ? "Whitelist" : "Remove from whitelist";
    if (!confirm(`${verb} ${name}?`)) return;
    run("whitelist", { name, add });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <button
          className="rounded bg-orange-600 px-3 py-1 text-sm text-white hover:bg-orange-700 disabled:opacity-50"
          onClick={kick}
          disabled={pending}
        >
          Kick
        </button>
        {banned ? (
          <button
            className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700 disabled:opacity-50"
            onClick={pardon}
            disabled={pending}
          >
            Unban
          </button>
        ) : (
          <button
            className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 disabled:opacity-50"
            onClick={ban}
            disabled={pending}
          >
            Ban
          </button>
        )}
        <button
          className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
          onClick={() => whitelist(true)}
          disabled={pending}
        >
          Whitelist
        </button>
        <button
          className="rounded bg-gray-600 px-3 py-1 text-sm text-white hover:bg-gray-700 disabled:opacity-50"
          onClick={() => whitelist(false)}
          disabled={pending}
        >
          Unwhitelist
        </button>
      </div>
      {message && (
        <p
          className={`rounded p-2 text-sm ${
            message.ok
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
