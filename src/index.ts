import express from "express";
import { createServer } from "http";
import socketio from "socket.io";
import tmi from "tmi.js";
import ObsWebSocket from "obs-websocket-js";

import TwitchChatClient from "./TwitchChatClient";
import InfoCommands from "./InfoCommands";
import ObsCommands from "./ObsCommands";
import ObsClient from "./ObsClient";

require("dotenv").config();

const main = async () => {
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

  const twitchChatClient = new TwitchChatClient(client);
  const infoCommands = new InfoCommands(twitchChatClient);

  const obsWebSocket = new ObsWebSocket();
  await obsWebSocket.connect({
    address: process.env.OBS_ADDRESS,
  });

  const obsClient = new ObsClient(obsWebSocket);
  const obsCommands = new ObsCommands(obsClient);

  client.on("message", (target, context, msg, self) => {
    if (self) return;

    infoCommands.process(target, context, msg, self);
    obsCommands.process(target, context, msg, self);
  });

  const port = process.env.PORT;
  http.listen(port, () => {
    console.log(`dharnbot-server listening on *:${port}`);
  });
};

main();
