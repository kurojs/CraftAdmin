import { useState, type FormEvent } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      await login(username, password);
      navigate("/", { replace: true });
    } catch {
      setError("Invalid username or password");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mc-login">
      <span className="mc-sun" aria-hidden="true" />
      <span className="mc-cloud mc-cloud-1" aria-hidden="true" />
      <span className="mc-cloud mc-cloud-2" aria-hidden="true" />
      <span className="mc-cloud mc-cloud-3" aria-hidden="true" />
      <div className="mc-ground" aria-hidden="true" />

      <main className="mc-login-wrap">
        <div className="mc-login-brand">
          <span
            className="mc-grass-block mc-grass-block-lg"
            aria-hidden="true"
          />
          <div>
            <p className="mc-logo-xl">
              Craft<span>Admin</span>
            </p>
            <p className="mc-logo-sub">Minecraft server panel</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mc-panel mc-login-card">
          <div className="mc-panel-head">
            <h1 className="mc-panel-title">Sign in</h1>
            <span className="mc-badge mc-badge-gold">Admin panel</span>
          </div>

          {error && (
            <p className="mc-alert mc-alert-error mb-4" role="alert">
              {error}
            </p>
          )}

          <div className="mb-3">
            <label htmlFor="username" className="mc-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              className="mc-input"
              placeholder="Steve"
              required
            />
          </div>

          <div className="mb-5">
            <label htmlFor="password" className="mc-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              className="mc-input"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="mc-btn mc-btn-primary mc-btn-block"
          >
            <LogIn aria-hidden="true" />
            {pending ? "Signing in..." : "Sign in"}
          </button>

          <p className="mc-hint mt-4 text-center">
            CraftAdmin · Minecraft server administration
          </p>
        </form>
      </main>
    </div>
  );
}
