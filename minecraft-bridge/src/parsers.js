const DEATH_MESSAGE = [
  "was slain by",
  "was shot by",
  "fell from",
  "hit the ground too hard",
  "drowned",
  "burned to death",
  "went up in flames",
  "blew up",
  "was blown up by",
  "starved to death",
  "suffocated in a wall",
  "tried to swim in lava",
  "was killed",
  "withered away",
  "was pricked to death",
  "was fireballed by",
  "froze to death",
  "was squashed",
  "died",
];

export function parseLine(line) {
  const prefix = line.match(/^\[[^\]]*\](?: \[[^\]]*\])?:? (.*)$/);
  if (!prefix) return null;
  const msg = prefix[1];
  let m;
  // CHAT
  m = msg.match(/^(?:\[Not Secure\] )?<([A-Za-z0-9_]{3,16})> (.*)$/);
  if (m) return { type: "CHAT", name: m[1], message: m[2], rawLine: line };

  // UUID
  m = msg.match(/^UUID of player ([A-Za-z0-9_]{3,16}) is ([0-9a-f-]{36})$/);
  if (m) return { type: "UUID", name: m[1], uuid: m[2], rawLine: line };

  //  LOGIN
  m = msg.match(
    /^([A-Za-z0-9_]{3,16})\[\/[^\]]+\] logged in with entity id \d+ at \(([-\d.]+), ([-\d.]+), ([-\d.]+)\)$/,
  );
  if (m) {
    return {
      type: "LOGIN",
      name: m[1],
      x: Number(m[2]),
      y: Number(m[3]),
      z: Number(m[4]),
      rawLine: line,
    };
  }
  // JOIN
  m = msg.match(/^([A-Za-z0-9_]{3,16}) joined the game$/);
  if (m) return { type: "JOIN", name: m[1], rawLine: line };

  // LEAVE
  m = msg.match(/^([A-Za-z0-9_]{3,16}) left the game$/);
  if (m) return { type: "LEAVE", name: m[1], rawLine: line };

  // ADVANCEMENT
  m = msg.match(
    /^([A-Za-z0-9_]{3,16}) (?:has made the advancement|has completed the challenge|has reached the goal) \[(.*)\]$/,
  );
  if (m)
    return { type: "ADVANCEMENT", name: m[1], message: m[2], rawLine: line };

  // SERVER_START
  m = msg.match(/^Done \(.*\)! For help, type "help"$/);
  if (m) return { type: "SERVER_START", rawLine: line };

  // SERVER_STOP
  m = msg.match(/^Stopping server$/);
  if (m) return { type: "SERVER_STOP", rawLine: line };

  // DEATH   (ver explicación especial abajo)
  m = msg.match(/^([A-Za-z0-9_]{3,16}) (.+)$/);
  if (m && DEATH_MESSAGE.some((death) => m[2].startsWith(death))) {
    return { type: "DEATH", name: m[1], message: msg, rawLine: line };
  }

  return null;
}
