import express from "express";
import { createServer } from "http";
import socketio from "socket.io";
import tmi from "tmi.js";

require("dotenv").config();

const app = express();
const http = createServer(app);
const io = socketio(http);

app.get("/", (_req, res) => {
  res.send("dharnbot-server");
});

io.on("connection", (_socket) => {
  console.log("a client connected to socket");
});

const client = new tmi.Client({
  options: { debug: true },
  connection: {
    secure: true,
    reconnect: true,
  },
  identity: {
    username: process.env.TMI_USERNAME,
    password: process.env.TMI_OAUTH_TOKEN,
  },
  channels: [process.env.TMI_CHANNEL],
});

client.connect();

client.on("message", (target, context, msg, self) => {
  if (self) return;

  const commandName = msg.trim();
  if (commandName === "!hello") {
    client.say(target, "Welcome!");
  }
});

const port = process.env.PORT;
http.listen(port, () => {
  console.log(`dharnbot-server listening on *:${port}`);
});
