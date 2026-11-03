import { Rcon } from "rcon-client";
import { config } from "./config.js";

let connection = null;

async function connect() {
  connection = await Rcon.connect({
    host: config.rconHost,
    port: config.rconPort,
    password: config.rconPassword,
  });

  connection.on("end", () => {
    connection = null;
    console.log("RCON connection closed");
  });
}

export async function sendRconCommand(command) {
  try {
    if (!connection) await connect();
    const response = await connection.send(command);
    return { ok: true, response: response };
  } catch (err) {
    connection = null;
    return {
      ok: false,
      response: "RCON connection error: " + err.message,
    };
  }
}
