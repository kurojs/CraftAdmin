import { useEffect, useState, type ReactNode } from "react";
import { apiClient, setOnUnauthenticated } from "../api/client";
import type { OnUnauthenticated } from "../api/client";
import type { Role } from "../api/types";
import { AuthContext, type User } from "./auth";

interface LoginResponse {
  token: string;
  username: string;
  role: Role;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const username = sessionStorage.getItem("username");
    const role = sessionStorage.getItem("role") as Role | null;
    return username && role ? { username, role } : null;
  });

  useEffect(() => {
    const handleUnauthenticated: OnUnauthenticated = () => {
      sessionStorage.clear();
      setUser(null);
    };

    setOnUnauthenticated(handleUnauthenticated);

    return () => {
      setOnUnauthenticated(undefined);
    };
  }, []);

  async function login(username: string, password: string) {
    try {
      const res = await apiClient.post<LoginResponse>("/auth/login", {
        username,
        password,
      });
      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("username", res.data.username);
      sessionStorage.setItem("role", res.data.role);
      setUser({ username: res.data.username, role: res.data.role });
    } catch (error) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("username");
      sessionStorage.removeItem("role");
      setUser(null);
      throw error;
    }
  }

  function logout() {
    sessionStorage.clear();
    setUser(null);
    window.location.href = "/login";
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
