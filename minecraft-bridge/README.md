# minecraft-bridge

Node.js process that reads the Minecraft server log, forwards what happens to the
CraftAdmin backend, and executes RCON commands on request.

The project is scaffolded: dependencies are installed, configuration is wired and the
entry point starts. The modules below are empty on purpose, ready to be implemented.

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
| `src/logWatcher.js` | `watchLog(path, onLine)` follows the log file |
| `src/apiClient.js` | Backend calls: events, status and sync |
| `src/statusPoller.js` | `getStatus()` pings the server for its state and roster |
| `src/rconClient.js` | `runCommand(cmd)` keeps the RCON connection |
| `src/server.js` | Fastify server exposing `POST /cmd` |
| `test/parsers.test.js` | Parser tests |

## Next steps

1. Parse log lines and test them.
2. Watch the log, buffer events and post them to the backend.
3. Report server status and sync the roster on startup.
4. Expose `POST /cmd` over RCON.
