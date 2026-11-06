import { NavLink, Outlet } from "react-router-dom";
import {
  Activity,
  LayoutDashboard,
  LogOut,
  ScrollText,
  Terminal,
  Users,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useServerStatus } from "../hooks/useServerStatus";
import Brand from "./Brand";
import PlayerAvatar from "./PlayerAvatar";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  "mc-nav-link shrink-0 whitespace-nowrap" +
  (isActive ? " mc-nav-link-active" : "");

export default function Layout() {
  const { user, logout } = useAuth();
  const statusQuery = useServerStatus();
  const status = statusQuery.data;

  let statusText = "Checking server";
  if (statusQuery.isError) statusText = "Server unknown";
  else if (status) statusText = status.online ? "Server online" : "Server offline";

  return (
    <div className="mc-page flex min-h-screen flex-col md:flex-row">
      <aside className="mc-sidebar flex w-full shrink-0 flex-col gap-3 p-3 md:sticky md:top-0 md:h-screen md:w-72 md:gap-4 md:overflow-y-auto md:p-5">
        <div className="flex items-center justify-between gap-3">
          <Brand />
          <button
            type="button"
            aria-label="Logout"
            className="mc-btn mc-btn-danger mc-btn-sm h-9 w-9 shrink-0 justify-center p-0 md:hidden"
            onClick={logout}
          >
            <LogOut aria-hidden="true" />
          </button>
        </div>

        <div className="mc-user-card">
          <PlayerAvatar name={user?.username ?? "Steve"} size={36} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {user?.username}
            </p>
            <p className="mc-label mc-label-inline">{user?.role}</p>
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto pb-1 md:flex-1 md:flex-col md:overflow-visible md:pb-0">
          <NavLink to="/" end className={linkClass}>
            <LayoutDashboard aria-hidden="true" />
            Dashboard
          </NavLink>
          <NavLink to="/players" className={linkClass}>
            <Users aria-hidden="true" />
            Players
          </NavLink>
          <NavLink to="/events" className={linkClass}>
            <Activity aria-hidden="true" />
            Events
          </NavLink>
          {user?.role === "ADMIN" && (
            <NavLink to="/console" className={linkClass}>
              <Terminal aria-hidden="true" />
              Console
            </NavLink>
          )}
          {user?.role === "ADMIN" && (
            <NavLink to="/audit" className={linkClass}>
              <ScrollText aria-hidden="true" />
              Audit
            </NavLink>
          )}
        </nav>

        <div className="mc-side-status md:hidden">
          <span
            className={"mc-dot" + (status?.online ? "" : " mc-dot-off")}
            aria-hidden="true"
          />
          <span>{statusText}</span>
        </div>

        <div className="hidden md:flex md:flex-col md:gap-2">
          <div className="mc-side-status">
            <span
              className={"mc-dot" + (status?.online ? "" : " mc-dot-off")}
              aria-hidden="true"
            />
            <span>{statusText}</span>
          </div>
          <button
            type="button"
            className="mc-btn mc-btn-danger mc-btn-block"
            onClick={logout}
          >
            <LogOut aria-hidden="true" />
            Logout
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-4 md:p-8">
        <div className="mc-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
