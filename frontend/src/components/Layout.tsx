import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  "block rounded px-3 py-2 text-sm " +
  (isActive
    ? "bg-gray-900 text-white"
    : "text-gray-300 hover:bg-gray-700 hover:text-white");

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-64 flex-col border-r bg-gray-800 p-4">
        <div className="mb-6">
          <p className="text-lg font-bold text-white">CraftAdmin</p>
          <p className="text-sm text-gray-400">{user?.username}</p>
          <p className="text-xs text-gray-500">{user?.role}</p>
        </div>

        <nav className="flex-1 space-y-1">
          <NavLink to="/" end className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/players" className={linkClass}>
            Players
          </NavLink>
          <NavLink to="/events" className={linkClass}>
            Events
          </NavLink>
          {user?.role === "ADMIN" && (
            <NavLink to="/console" className={linkClass}>
              Console
            </NavLink>
          )}
          {user?.role === "ADMIN" && (
            <NavLink to="/audit" className={linkClass}>
              Audit
            </NavLink>
          )}
        </nav>

        <button
          className="mt-4 rounded bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
          onClick={logout}
        >
          Logout
        </button>
      </aside>
      <main className="flex-1 bg-gray-50 p-6">
        <Outlet />
      </main>
    </div>
  );
}
