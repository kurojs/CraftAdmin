import { config } from "./config.js";

async function post(path, body) {
  const response = await fetch(config.springUrl + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": config.apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Backend responded ${response.status}`);
  }
}

export const sendEvents = (events) => post("/api/bridge/events", events);
export const sendStatus = (status) => post("/api/bridge/status", status);
export const sendSync = (list) => post("/api/bridge/sync", { online: list });
