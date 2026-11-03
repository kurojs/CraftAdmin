import Fastify from "fastify";
import { config } from "./config.js";
import { sendRconCommand } from "./rconClient.js";

const COMMANDS = [
  "kick",
  "ban",
  "pardon",
  "whitelist",
  "say",
  "list",
  "tp",
  "give",
  "time",
  "weather",
  "gamemode",
];

export async function startServer() {
  const app = Fastify();

  app.addHook("onRequest", async (req, reply) => {
    if (req.headers["x-api-key"] !== config.apiKey) {
      return reply.code(401).send({ ok: false, response: "Not authorized" });
    }
  });

  app.post("/cmd", async (req) => {
    const command = req.body?.command;

    if (!command) {
      return { ok: false, response: "No command provided" };
    }

    if (typeof command !== "string") {
      return { ok: false, response: "Command must be a string" };
    }

    if (command.includes("\n") || command.includes("\r")) {
      return { ok: false, response: "Command must be a single line" };
    }

    if (!COMMANDS.includes(command.split(" ")[0])) {
      return { ok: false, response: "Command not allowed" };
    }

    return await sendRconCommand(command);
  });

  await app.listen({ host: "127.0.0.1", port: config.bridgePort });
  console.log(`Command server listening on 127.0.0.1:${config.bridgePort}`);
}
