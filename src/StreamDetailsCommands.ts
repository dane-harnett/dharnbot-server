import fs from "fs";
import { Socket } from "socket.io";

import EventEmitter from "./EventEmitter";
import ICommandData from "./interfaces/ICommandData";

const configFilePath = "./config/StreamDetailsCommandConfig.json";

export default class StreamDetailsCommands {
  eventEmitter: EventEmitter;
  sockets: { [key: string]: boolean };
  eventsListening: boolean;
  constructor(eventEmitter: EventEmitter) {
    this.eventEmitter = eventEmitter;
    this.sockets = {};
    this.eventsListening = false;
  }

  getCommandInfoList() {
    return ["!title", "!next-agenda-item"];
  }

  onConnection(socket: Socket) {
    if (this.sockets[socket.id]) {
      return;
    }

    console.log("preparing for socket connections for socket: " + socket.id);
    this.eventEmitter.on("CHANGE_STREAM_TITLE", (data) => {
      socket.emit("CHANGE_STREAM_TITLE", data);
    });
    this.eventEmitter.on("CHANGE_STREAM_TOPIC", (data) => {
      socket.emit("CHANGE_STREAM_TOPIC", data);
    });
    socket.on("STREAM_DETAILS_REQUEST", async () => {
      console.log("STREAM_DETAILS_REQUEST");
      const jsonConfig = this.readConfig();

      socket.emit("STREAM_DETAILS_RESPONSE", {
        streamDetails: jsonConfig,
      });
    });

    this.sockets[socket.id] = true;

    if (this.eventsListening) {
      return;
    }

    this.eventEmitter.on("NEXT_AGENDA_ITEM", () => {
      console.log("handling NEXT_AGENDA_ITEM");
      const jsonConfig = this.readConfig();
      jsonConfig.currentAgendaItemIndex++;
      this.writeConfig(jsonConfig);
      socket.emit("STREAM_DETAILS_RESPONSE", {
        streamDetails: jsonConfig,
      });
    });

    this.eventEmitter.on("SET_AGENDA_ITEM", (data) => {
      console.log("handling SET_AGENDA_ITEM");
      const jsonConfig = this.readConfig();
      jsonConfig.currentAgendaItemIndex = data.desiredAgendaItemIndex;
      this.writeConfig(jsonConfig);
      socket.emit("STREAM_DETAILS_RESPONSE", {
        streamDetails: jsonConfig,
      });
    });

    this.eventsListening = true;
  }

  readConfig() {
    const configData = fs.readFileSync(configFilePath, {
      encoding: "utf8",
      flag: "r",
    });
    return JSON.parse(configData);
  }

  writeConfig(jsonConfig: { currentAgendaItemIndex: number }) {
    fs.writeFileSync(configFilePath, JSON.stringify(jsonConfig, null, 2));
  }

  process(commandData: ICommandData) {
    const {
      message: { message: msg, context },
    } = commandData;

    if (context.badges?.broadcaster !== "1" && !context.mod) {
      return;
    }

    if (msg.startsWith("!title")) {
      this.eventEmitter.emit("CHANGE_STREAM_TITLE", {
        streamTitle: msg.replace("!title ", ""),
      });
    }

    if (msg.startsWith("!topic")) {
      this.eventEmitter.emit("CHANGE_STREAM_TOPIC", {
        streamTopic: msg.replace("!topic ", ""),
      });
    }

    if (msg.startsWith("!next-agenda-item")) {
      this.eventEmitter.emit("NEXT_AGENDA_ITEM", {});
    }

    if (msg.startsWith("!set-agenda-item")) {
      this.eventEmitter.emit("SET_AGENDA_ITEM", {
        desiredAgendaItemIndex: parseInt(
          msg.replace("!set-agenda-item ", ""),
          10
        ),
      });
    }
  }
}
