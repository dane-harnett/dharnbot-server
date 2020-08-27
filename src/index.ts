import express from "express";
import { createServer } from "http";
import socketio from "socket.io";
import tmi from "tmi.js";
import ObsWebSocket from "obs-websocket-js";

import TwitchChatClient from "./TwitchChatClient";
import InfoCommands from "./InfoCommands";
import ObsCommands from "./ObsCommands";
import ObsClient from "./ObsClient";
import EventEmitter from "./EventEmitter";
import TwitchClient from "./TwitchClient";

require("dotenv").config();

const main = async () => {
  const app = express();
  const http = createServer(app);
  const io = socketio(http);

  const twitchClient = new TwitchClient(
    process.env.TWITCH_CLIENT_ID || "",
    process.env.TWITCH_CLIENT_SECRET || ""
  );
  await twitchClient.authorize();

  app.get("/", (_req, res) => {
    res.send("dharnbot-server");
  });

  const eventEmitter = EventEmitter.create();

  io.on("connection", (_socket) => {
    console.log("a client connected to socket");
    eventEmitter.on("INFO_PANEL", (data) => {
      _socket.emit("INFO_PANEL", data);
    });
  });

  const client = new (tmi.Client as any)({
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
  const infoCommands = new InfoCommands(twitchChatClient, eventEmitter);

  const obsWebSocket = new ObsWebSocket();
  await obsWebSocket.connect({
    address: process.env.OBS_ADDRESS,
  });

  const obsClient = new ObsClient(obsWebSocket);
  const obsCommands = new ObsCommands(obsClient);

  client.on(
    "message",
    async (
      channel: string,
      context: {
        badges?: { broadcaster: "1" | "0" };
        mod: boolean;
        username: string;
      },
      message: string,
      self: boolean
    ) => {
      if (self) return;

      const user = await twitchClient.getUser(context.username);

      const commandData = { message: { channel, context, message }, user };

      infoCommands.process(commandData);
      obsCommands.process(commandData);
    }
  );

  const port = process.env.PORT;
  http.listen(port, () => {
    console.log(`dharnbot-server listening on *:${port}`);
  });
};

main();
