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
  SPRING_URL: process.env.SPRING_URL,
  API_KEY: process.env.API_KEY,
  LOG_PATH: process.env.LOG_PATH,
  MC_HOST: process.env.MC_HOST,
  MC_PORT: Number(process.env.MC_PORT),
  RCON_HOST: process.env.RCON_HOST,
  RCON_PORT: Number(process.env.RCON_PORT),
  RCON_PASSWORD: process.env.RCON_PASSWORD,
  BRIDGE_PORT: Number(process.env.BRIDGE_PORT),
};
