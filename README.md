# CraftAdmin — Minecraft Server Admin Panel

Backend API for a Minecraft server admin panel. It stores what happens on the server (joins,
leaves, chat, deaths, advancements), tracks play sessions, serves player skins, streams live
events and runs moderation commands through a local bridge process.

The backend is implemented. The other two programs of the panel, a Node.js bridge that reads
the server log and executes RCON commands and a React frontend, are scaffolded with their
dependencies installed and their file structure in place.

## Stack

- Java 21 and Spring Boot 4.1.2
- Spring Security: JWT for panel users, API key for the bridge
- Spring Data JPA with H2 in file mode (`backend/data/`)
- JJWT 0.13.0 for token signing

## Requirements

- JDK 21 or newer
- The Maven wrapper is included, so a local Maven install is not required

## Run

```bash
cd backend
./mvnw spring-boot:run
```

The API listens on `http://localhost:8080` and the H2 console is available at `/h2-console`.

The first start creates the schema and seeds an administrator when the admin table is empty:

| Username | Password |
|---|---|
| `admin` | `admin1234` |

## Configuration

Every value can be overridden with an environment variable. The defaults are meant for local
development only.

| Variable | Default | Purpose |
|---|---|---|
| `JWT_SECRET` | development secret | HS256 signing key, 32 characters or more |
| `ADMIN_USER` | `admin` | Username of the seeded administrator |
| `ADMIN_PASSWORD` | `admin1234` | Password of the seeded administrator |
| `BRIDGE_API_KEY` | `dev-bridge-key` | Shared key required by `/api/bridge/**` |
| `BRIDGE_URL` | `http://127.0.0.1:4001` | Base URL of the bridge command endpoint |

## API

Panel routes expect `Authorization: Bearer <token>`. Bridge routes expect `X-API-Key`.

| Method | Path | Role | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | public | Exchange credentials for a JWT |
| `POST` | `/api/admins` | `ADMIN` | Create another panel user |
| `GET` | `/api/players` | `VIEWER`+ | Paginated players (`q`, `online`, `page`, `size`, `sort`) |
| `GET` | `/api/players/{uuid}` | `VIEWER`+ | Single player |
| `GET` | `/api/players/{uuid}/sessions` | `VIEWER`+ | Play sessions of a player |
| `GET` | `/api/players/{name}/skin` | `VIEWER`+ | Player skin as `image/png` |
| `GET` | `/api/events` | `VIEWER`+ | Paginated events (`type`, `playerUuid`, `page`, `size`) |
| `GET` | `/api/events/stream` | `VIEWER`+ | Server-sent events with live game events |
| `GET` | `/api/server/status` | `VIEWER`+ | Last reported server status |
| `GET` | `/api/stats/activity` | `VIEWER`+ | Activity of the last 14 days |
| `POST` | `/api/actions/kick` | `MODERATOR`+ | Kick a player |
| `POST` | `/api/actions/ban` | `MODERATOR`+ | Ban a player |
| `POST` | `/api/actions/pardon` | `MODERATOR`+ | Remove a ban |
| `POST` | `/api/actions/whitelist` | `MODERATOR`+ | Add or remove a whitelist entry |
| `POST` | `/api/actions/say` | `MODERATOR`+ | Broadcast a chat message |
| `POST` | `/api/actions/raw` | `ADMIN` | Run a raw command on the server |
| `GET` | `/api/audit` | `ADMIN` | Paginated audit log of moderation actions |
| `POST` | `/api/bridge/events` | `BRIDGE` | Ingest game events from the bridge |
| `POST` | `/api/bridge/status` | `BRIDGE` | Report server status |
| `POST` | `/api/bridge/sync` | `BRIDGE` | Reconcile which players are online |

Server status is considered stale after 15 seconds without an update, and is reported as
offline from then on.

## Tests

```bash
cd backend
./mvnw test
```
