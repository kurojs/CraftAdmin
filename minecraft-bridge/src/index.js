import { config } from "./config.js";
import { parseLine } from "./parsers.js";
import { watchLogFile } from "./logWatcher.js";
import { sendEvents, sendStatus, sendSync } from "./apiClient.js";
import { getStatus } from "./statusPoller.js";
import { startServer } from "./server.js";

const pending = new Map();

let inbox = [];

function processLine(line) {
  const ev = parseLine(line);
  if (!ev) return;

  if (ev.type === "UUID") {
    const oldData = pending.get(ev.name) ?? {};
    pending.set(ev.name, { ...oldData, uuid: ev.uuid });

    return;
  }

  if (ev.type === "LOGIN") {
    const oldData = pending.get(ev.name) ?? {};
    pending.set(ev.name, { ...oldData, x: ev.x, y: ev.y, z: ev.z });

    return;
  }

  let event = ev;

  if (ev.type === "JOIN") {
    const data = pending.get(ev.name);

    if (!data || !data.uuid) {
      console.warn(`JOIN event for ${ev.name} without UUID, skipping`);
      return;
    }

    event = { ...ev, uuid: data.uuid, x: data.x, y: data.y, z: data.z };
    pending.delete(ev.name);
  }

  event = { ...event, at: new Date().toISOString() };
  inbox.push(event);
}

setInterval(async () => {
  if (inbox.length === 0) return;

  const batch = inbox;

  inbox = [];

  try {
    await sendEvents(batch);
    console.log(`Sent ${batch.length} events`);
  } catch (err) {
    console.error("Error sending events, retrying in 1 s:", err.message);
    inbox = [...batch, ...inbox];
  }
}, 1000);

watchLogFile(config.logPath, processLine);

async function pollStatus() {
  const { samplePlayers, ...status } = await getStatus();

  try {
    await sendStatus(status);
  } catch (err) {
    console.error("Error sending status:", err.message);
  }
}

setInterval(pollStatus, 5000);

const initial = await getStatus();

if (initial.online) {
  try {
    await sendSync(
      initial.samplePlayers.map((p) => ({ uuid: p.id, name: p.name })),
    );
    console.log(`Synced ${initial.samplePlayers.length} players`);
  } catch (err) {
    console.error("Could not sync players:", err.message);
  }
}

console.log(`Watching log file: ${config.logPath}`);

await startServer();
