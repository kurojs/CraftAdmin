# CraftAdmin — Minecraft Server Admin Panel

Admin panel for a Minecraft server. The backend stores what happens on the server (joins,
leaves, chat, deaths, advancements), tracks play sessions, serves player skins, streams live
events and runs moderation commands through a local bridge process. A React frontend shows
all of it.

The three programs of the panel are implemented: the backend API, the Node.js bridge that
reads the server log and executes RCON commands, and the React frontend.

## Stack

- Java 21 and Spring Boot 4.1.2
- Spring Security: JWT for panel users, API key for the bridge
- Spring Data JPA with H2 in file mode (`backend/data/`)
- JJWT 0.13.0 for token signing
- Node.js 20 or newer for the bridge: Fastify, `tail`, `minecraft-server-util`, `rcon-client`
- React 19, TypeScript, Vite, Tailwind, React Query, Recharts and skinview3d

## Requirements

- JDK 21 or newer
- Node.js 20 or newer
- The Maven wrapper is included, so a local Maven install is not required

## Run

The backend, the bridge and the frontend run as three separate processes. Start them in
this order, each in its own terminal.

### 1. Backend

```bash
cd backend
./mvnw spring-boot:run
```

The API listens on `http://localhost:8080` and the H2 console is available at `/h2-console`.

The first start creates the schema and seeds an administrator when the admin table is empty:

| Username | Password |
|---|---|
| `admin` | `admin1234` |

### 2. Bridge

```bash
cd minecraft-bridge
cp .env.example .env   # once, then set LOG_PATH and the RCON password
npm install
npm start
```

The bridge follows the Minecraft server log, forwards events to the backend and exposes
`POST /cmd` on `http://127.0.0.1:4001` for moderation commands. It needs the Minecraft
server running for the status ping and RCON; without it the panel shows the server as
offline and every action returns the RCON error.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` and sign in with the seeded administrator. The dev server
proxies `/api` to the backend, so no CORS configuration is needed.

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

## Security

The defaults in this repository are for local development only. Before exposing the panel
outside your machine, change at least:

- `ADMIN_PASSWORD`: the seeded `admin` / `admin1234` is public knowledge.
- `BRIDGE_API_KEY`: the key travels as a plain header, so it must not stay at its default.
- `JWT_SECRET`: the fallback secret is in the source and is only meant for development.

The panel speaks plain HTTP and keeps the token in `sessionStorage`. Put it behind a TLS
reverse proxy and keep the H2 console at `/h2-console` unreachable from outside.

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

## License

MIT. See [LICENSE](LICENSE).
