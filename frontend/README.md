# frontend

React panel for CraftAdmin. The project is scaffolded with Vite, React, TypeScript and
Tailwind, dependencies are installed and the dev server proxies `/api` to the backend.
The files below are empty on purpose, ready to be implemented.

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
| `src/api/client.ts` | Axios instance with the token interceptor and the 401 redirect |
| `src/api/types.ts` | TypeScript types mirroring the backend DTOs |
| `src/context/AuthContext.tsx` | Session state, `login` and `logout` |
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

`src/App.tsx` and `src/main.tsx` are still the Vite template and are replaced when the
routing and session wiring are implemented.

## Next steps

1. HTTP client, session context and protected routing.
2. Dashboard with server status, online players and the live feed.
3. Player list, event history and player profile with the 3D skin.
4. Moderation actions, console, audit and the activity chart.
