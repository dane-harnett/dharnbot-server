import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import socketio, { Socket } from "socket.io";
import tmi from "tmi.js";
import ObsWebSocket from "obs-websocket-js";

import TwitchChatClient from "./TwitchChatClient";
import DropCommands from "./DropCommands";
import InfoCommands from "./InfoCommands";
import ObsCommands from "./ObsCommands";
import ObsClient from "./ObsClient";
import EventEmitter from "./EventEmitter";
import TwitchClient from "./TwitchClient";
import Randomizer from "./Randomizer";
import ReplyCommands from "./ReplyCommands";
import StreamDetailsCommands from "./StreamDetailsCommands";

dotenv.config();

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

  const streamDetailsCommands = new StreamDetailsCommands(eventEmitter);

  io.on("connection", (socket: Socket) => {
    console.log("a client connected to socket");
    eventEmitter.on("INFO_PANEL", (data) => {
      socket.emit("INFO_PANEL", data);
    });
    eventEmitter.on("MESSAGE", (data) => {
      socket.emit("MESSAGE", data);
    });
    eventEmitter.on("TEST_RESULTS", (data) => {
      socket.emit("TEST_RESULTS", data);
    });
    eventEmitter.on("RESET_TEST_RESULTS", (data) => {
      socket.emit("RESET_TEST_RESULTS", data);
    });

    streamDetailsCommands.onConnection(socket);

    socket.on("TWITCH_FOLLOWER_COUNT_REQUEST", async () => {
      console.log("twitch follower count request received");
      const userFollows = await twitchClient.getUsersFollows(
        "daneharnett",
        "to"
      );
      socket.emit("TWITCH_FOLLOWER_COUNT_RESPONSE", {
        followerCount: userFollows.total,
      });
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

  const randomizer = new Randomizer();
  const dropCommands = new DropCommands(randomizer, twitchChatClient);

  const commandProcessors = [
    replyCommands,
    dropCommands,
    infoCommands,
    obsCommands,
    streamDetailsCommands,
  ];

  client.on(
    "message",
    async (
      channel: string,
      context: {
        badges?: { broadcaster: "1" | "0" };
        color?: string;
        mod: boolean;
        username: string;
      },
      message: string,
      self: boolean
    ) => {
      if (self) return;

      if (message === "!commands" && process.env.TMI_CHANNEL) {
        const commands = commandProcessors.reduce<string[]>(
          (acc, cp) => acc.concat(cp.getCommandInfoList()),
          []
        );
        twitchChatClient.say(process.env.TMI_CHANNEL, commands.join(", "));
      }

      const user = await twitchClient.getUser(context.username);

      const commandData = {
        message: { channel, context, message },
        user: { ...user, color: context.color },
      };

      commandProcessors.forEach((cp) => {
        cp.process(commandData);
      });

      eventEmitter.emit("MESSAGE", commandData);
    }
  );

  const port = process.env.PORT;
  http.listen(port, () => {
    console.log(`dharnbot-server listening on *:${port}`);
  });
};

main();
