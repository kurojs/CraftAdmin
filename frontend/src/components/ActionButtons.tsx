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
      setMessage({
        ok: false,
        text: apiErrorMessage(error, "Failed to execute the action"),
      });
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
          className="mc-btn mc-btn-sm mc-btn-gold"
          onClick={kick}
          disabled={pending}
        >
          Kick
        </button>
        {banned ? (
          <button
            className="mc-btn mc-btn-sm mc-btn-primary"
            onClick={pardon}
            disabled={pending}
          >
            Unban
          </button>
        ) : (
          <button
            className="mc-btn mc-btn-sm mc-btn-danger"
            onClick={ban}
            disabled={pending}
          >
            Ban
          </button>
        )}
        <button
          className="mc-btn mc-btn-sm mc-btn-primary"
          onClick={() => whitelist(true)}
          disabled={pending}
        >
          Whitelist
        </button>
        <button
          className="mc-btn mc-btn-sm"
          onClick={() => whitelist(false)}
          disabled={pending}
        >
          Unwhitelist
        </button>
      </div>
      {message && (
        <p
          className={
            "mc-alert " +
            (message.ok ? "mc-alert-ok" : "mc-alert-error")
          }
          role="status"
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
