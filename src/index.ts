import cors from "cors";
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
import ReplyCommands from "./ReplyCommands";

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

  const eventEmitter = EventEmitter.create();

  app.use(express.json());

  app.get("/", (_req, res) => {
    res.send("dharnbot-server");
  });

  app.options("/api/test-results", cors());
  app.post("/api/test-results", cors(), (req, res) => {
    eventEmitter.emit("TEST_RESULTS", req.body);
    res.json({ status: "ok" });
  });

  app.get("/api/test-results/reset", (_req, res) => {
    eventEmitter.emit("RESET_TEST_RESULTS");
    res.json({ status: "ok" });
  });

  io.on("connection", (_socket) => {
    console.log("a client connected to socket");
    eventEmitter.on("INFO_PANEL", (data) => {
      _socket.emit("INFO_PANEL", data);
    });
    eventEmitter.on("MESSAGE", (data) => {
      _socket.emit("MESSAGE", data);
    });
    eventEmitter.on("TEST_RESULTS", (data) => {
      _socket.emit("TEST_RESULTS", data);
    });
    eventEmitter.on("RESET_TEST_RESULTS", (data) => {
      _socket.emit("RESET_TEST_RESULTS", data);
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

  const infoCommands = new InfoCommands(eventEmitter);

  const obsWebSocket = new ObsWebSocket();
  await obsWebSocket.connect({
    address: process.env.OBS_ADDRESS,
  });

  const obsClient = new ObsClient(obsWebSocket);
  const obsCommands = new ObsCommands(obsClient);

  const twitchChatClient = new TwitchChatClient(client);
  const replyCommands = new ReplyCommands(twitchChatClient);

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

      if (message === "!commands" && process.env.TMI_CHANNEL) {
        const commands = replyCommands.getCommandInfoList();
        twitchChatClient.say(process.env.TMI_CHANNEL, commands.join(", "));
      }

      const user = await twitchClient.getUser(context.username);

      const commandData = { message: { channel, context, message }, user };

      replyCommands.process(commandData);
      infoCommands.process(commandData);
      obsCommands.process(commandData);

      eventEmitter.emit("MESSAGE", commandData);
    }
  );

  const port = process.env.PORT;
  http.listen(port, () => {
    console.log(`dharnbot-server listening on *:${port}`);
  });
};

main();
