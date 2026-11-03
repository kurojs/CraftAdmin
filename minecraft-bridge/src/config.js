const required = [
  "SPRING_URL",
  "API_KEY",
  "LOG_PATH",
  "MC_HOST",
  "MC_PORT",
  "RCON_HOST",
  "RCON_PORT",
  "RCON_PASSWORD",
  "BRIDGE_PORT",
];

const missing = required.filter((name) => !process.env[name]);

if (missing.length > 0) {
  throw new Error(`Missing environment variable: ${missing.join(", ")}`);
}

export const config = {
  springUrl: process.env.SPRING_URL,
  apiKey: process.env.API_KEY,
  logPath: process.env.LOG_PATH,
  mcHost: process.env.MC_HOST,
  mcPort: Number(process.env.MC_PORT),
  rconHost: process.env.RCON_HOST,
  rconPort: Number(process.env.RCON_PORT),
  rconPassword: process.env.RCON_PASSWORD,
  bridgePort: Number(process.env.BRIDGE_PORT),
};
