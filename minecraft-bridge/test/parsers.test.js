import { test } from "node:test";
import assert from "node:assert";
import { parseLine } from "../src/parsers.js";

test("JOIN", () => {
  const r = parseLine("[12:00:00] [Server thread/INFO]: Steve joined the game");
  assert.equal(r.type, "JOIN");
  assert.equal(r.name, "Steve");
});

test("LOGIN", () => {
  const r = parseLine(
    "[12:00:00] [Server thread/INFO]: Steve[/127.0.0.1:50234] logged in with entity id 5 at (10.5, 64.0, -3.2)",
  );
  assert.equal(r.type, "LOGIN");
  assert.equal(r.x, 10.5);
  assert.equal(r.y, 64.0);
});

test("null line", () => {
  const r = parseLine(
    "[12:00:00] [Server thread/INFO]: This is a test message",
  );
  assert.equal(r, null);
});

test("LEAVE ", () => {
  const r = parseLine("[12:00:00] [Server thread/INFO]: Steve left the game");
  assert.equal(r.type, "LEAVE");
  assert.equal(r.name, "Steve");
});

test("CHAT", () => {
  const r = parseLine("[12:00:00] [Server thread/INFO]: <Steve> Hello world");
  assert.equal(r.type, "CHAT");
  assert.equal(r.name, "Steve");
});

test("CHAT with Not Secure", () => {
  const r = parseLine(
    "[12:00:00] [Server thread/INFO]: [Not Secure] <Steve> Hello world",
  );
  assert.equal(r.type, "CHAT");
});

test("UUID", () => {
  const r = parseLine(
    "[12:00:00] [Server thread/INFO]: UUID of player Steve is 11111111-1111-1111-1111-111111111111",
  );
  assert.equal(r.type, "UUID");
  assert.equal(r.uuid, "11111111-1111-1111-1111-111111111111");
});

test("DEATH", () => {
  const r = parseLine(
    "[12:00:00] [Server thread/INFO]: Steve was slain by Zombie",
  );
  assert.equal(r.type, "DEATH");
});

test("ADVANCEMENT", () => {
  const r = parseLine(
    "[12:00:00] [Server thread/INFO]: Steve has made the advancement [Stone Age]",
  );
  assert.equal(r.type, "ADVANCEMENT");
  assert.equal(r.message, "Stone Age");
});

test("SERVER START", () => {
  const r = parseLine(
    '[12:00:00] [Server thread/INFO]: Done (3.456s)! For help, type "help"',
  );
  assert.equal(r.type, "SERVER_START");
});

test("SERVER STOP", () => {
  const r = parseLine("[12:00:00] [Server thread/INFO]: Stopping server");
  assert.equal(r.type, "SERVER_STOP");
});

test("CHAT with special characters", () => {
  const r = parseLine(
    "[12:00:00] [Server thread/INFO]: <Juan> Pepe left the game",
  );
  assert.equal(r.type, "CHAT");
});

test("DEATH with special characters", () => {
  const r = parseLine(
    "[12:00:00] [Server thread/INFO]: <Juan> Pepe was slain by Zombie",
  );
  assert.equal(r.type, "CHAT");
});

test("NULL", () => {
  const r = parseLine(
    "[12:00:00] [Server thread/INFO]: Preparing spawn area: 5%",
  );
  assert.equal(r, null);
});
