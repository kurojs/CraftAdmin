import { createContext } from "react";
import type { Role } from "../api/types";

export interface User {
  username: string;
  role: Role;
}

export interface AuthValue {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthValue | undefined>(undefined);
