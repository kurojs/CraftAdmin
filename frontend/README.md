# frontend

React panel for CraftAdmin. It is implemented: Vite, React, TypeScript and Tailwind, with
the dev server proxying `/api` to the backend.

## Scripts

```bash
npm run dev      # dev server on http://localhost:5173
npm run build    # type check and production build
npm run preview  # serve the production build
npm run lint     # oxlint
```

## Configuration

`vite.config.ts` registers the Tailwind plugin and proxies `/api` to
`http://localhost:8080`, so the browser talks to the same origin and CORS never applies.

## Layout

| File | Purpose |
|---|---|
| `src/api/client.ts` | Axios instance with the token interceptor and the 401 handling |
| `src/api/types.ts` | TypeScript types mirroring the backend DTOs |
| `src/context/auth.ts` | Auth context and session types |
| `src/context/AuthContext.tsx` | Session state, `login` and `logout` |
| `src/hooks/useAuth.ts` | Reads the auth context |
| `src/pages/Login.tsx` | Login form |
| `src/pages/Dashboard.tsx` | Server status, online players, live feed and chart |
| `src/pages/Players.tsx` | Player list with search, filter, sort and pagination |
| `src/pages/PlayerDetail.tsx` | Player profile, sessions and 3D skin |
| `src/pages/Events.tsx` | Event history with URL-backed filters |
| `src/pages/Console.tsx` | Raw command console (admins) |
| `src/pages/Audit.tsx` | Audit log table (admins) |
| `src/components/ProtectedRoute.tsx` | Redirects to `/login` without a session |
| `src/components/Layout.tsx` | Sidebar navigation and outlet |
| `src/components/PlayerAvatar.tsx` | Avatar with fallbacks |
| `src/components/SkinViewer3D.tsx` | skinview3d viewer with animations |
| `src/components/EventFeed.tsx` | Live event feed |
| `src/components/ActionButtons.tsx` | Kick, ban, pardon and whitelist actions |
| `src/components/ActivityChart.tsx` | Recharts activity chart |
| `src/hooks/` | One query or live-event hook per screen |
| `src/utils/format.ts` | Relative time and duration formatting |
| `src/utils/errors.ts` | Reads the backend error message |

## Session

The token, the username and the role live in `sessionStorage`, so closing the tab ends the
session. Every request sends `Authorization: Bearer <token>`; a `401` clears the session and
returns to `/login`.

Live events arrive over `GET /api/events/stream` (server-sent events) and refresh the
dashboard queries when a `game-event` message is received.

## Roles

`ADMIN` sees every screen. `MODERATOR` sees the dashboard, players, events and the moderation
buttons, but not the console or the audit log. `VIEWER` is read-only.
