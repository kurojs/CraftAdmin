# minecraft-bridge

Node.js process that reads the Minecraft server log, forwards what happens to the
CraftAdmin backend, and executes RCON commands on request.

The bridge is implemented: it parses the log, batches events to the backend, reports the
server status, syncs the roster on startup and executes RCON commands on request.

## Requirements

- Node.js 20 or newer (the start script uses `--env-file`)

## Scripts

```bash
npm start   # runs src/index.js with .env loaded
npm test    # runs the node:test suite
```

## Configuration

`.env` holds the local values and is not versioned. `.env.example` is the template.

| Variable | Purpose |
|---|---|
| `SPRING_URL` | Base URL of the CraftAdmin backend |
| `API_KEY` | Shared key sent as `X-API-Key` to the backend and expected on `/cmd` |
| `LOG_PATH` | Absolute path to the server `logs/latest.log` |
| `MC_HOST`, `MC_PORT` | Minecraft server address used for the status ping |
| `RCON_HOST`, `RCON_PORT`, `RCON_PASSWORD` | RCON endpoint used to run commands |
| `BRIDGE_PORT` | Port of the local command server |

`src/config.js` reads the variables and throws naming any that are missing.

## Layout

| File | Purpose |
|---|---|
| `src/config.js` | Environment loading and validation |
| `src/index.js` | Entry point and pipeline wiring |
| `src/parsers.js` | `parseLine(line)` turns a log line into an event object |
| `src/logWatcher.js` | `watchLogFile(path, onLine)` follows the log file |
| `src/apiClient.js` | Backend calls: `sendEvents`, `sendStatus` and `sendSync` |
| `src/statusPoller.js` | `getStatus()` pings the server for its state and roster |
| `src/rconClient.js` | `sendRconCommand(cmd)` keeps the RCON connection |
| `src/server.js` | Fastify server exposing `POST /cmd` |
| `test/parsers.test.js` | Parser tests |

## Behaviour

- Log lines are parsed into events and buffered for one second; the batch is posted to
  `/api/bridge/events` and put back in the buffer if the backend is unreachable.
- A `UUID` line and the matching `LOGIN` line are kept in memory so the `JOIN` event
  carries the player UUID and coordinates.
- The server status is reported every five seconds, and the roster is synced once on
  startup so players left online by a crash are reconciled.
- `POST /cmd` requires `X-API-Key`, rejects multi-line input and only runs the commands
  in its allow list.
