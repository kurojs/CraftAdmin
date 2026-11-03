export type Role = "ADMIN" | "MODERATOR" | "VIEWER";

export type Event =
  | "JOIN"
  | "LEAVE"
  | "CHAT"
  | "DEATH"
  | "ADVANCEMENT"
  | "SERVER_START"
  | "SERVER_STOP";

export interface Page<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
}

export interface Player {
  uuid: string;
  name: string;
  firstSeen: string;
  lastSeen: string;
  totalPlaytimeSeconds: number;
  online: boolean;
  banned: boolean;
}

export interface Session {
  id: number;
  joinedAt: string;
  leftAt: string | null;
  durationSeconds: number | null;
}

export interface GameEvent {
  id: number;
  type: Event;
  playerUuid: string | null;
  playerName: string | null;
  message: string | null;
  x: number | null;
  y: number | null;
  z: number | null;
  createdAt: string;
}

export interface ServerStatus {
  online: boolean;
  version: string;
  playersOnline: number;
  playersMax: number;
  latencyMs: number;
}

export interface AuditEntry {
  id: number;
  adminUsername: string | null;
  action: string;
  target: string | null;
  detail: string | null;
  success: boolean;
  createdAt: string;
}

export interface DayActivity {
  date: string;
  uniquePlayers: number;
  hoursPlayed: number;
}

export interface ActionResponse {
  success: boolean;
  response: string;
}
