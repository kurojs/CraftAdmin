import { status } from "minecraft-server-util";
import { config } from "./config.js";

export async function getStatus() {
  try {
    const result = await status(config.mcHost, config.mcPort, {
      timeout: 3000,
    });
    return {
      online: true,
      version: result.version.name,
      playersOnline: result.players.online,
      playersMax: result.players.max,
      latencyMs: result.roundTripLatency,
      samplePlayers: result.players.sample || [],
    };
  } catch {
    return {
      online: false,
      version: "",
      playersOnline: 0,
      playersMax: 0,
      latencyMs: 0,
      samplePlayers: [],
    };
  }
}
