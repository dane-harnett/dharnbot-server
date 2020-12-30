import { Socket } from "socket.io";

import EventEmitter from "./EventEmitter";
import ICommandData from "./interfaces/ICommandData";

export default class StreamDetailsCommands {
  eventEmitter: EventEmitter;
  constructor(eventEmitter: EventEmitter) {
    this.eventEmitter = eventEmitter;
  }

  getCommandInfoList() {
    return ["!title", "!topic"];
  }

  onConnection(socket: Socket) {
    this.eventEmitter.on("CHANGE_STREAM_TITLE", (data) => {
      socket.emit("CHANGE_STREAM_TITLE", data);
    });
    this.eventEmitter.on("CHANGE_STREAM_TOPIC", (data) => {
      socket.emit("CHANGE_STREAM_TOPIC", data);
    });
  }

  process(commandData: ICommandData) {
    const {
      message: { message: msg, context },
    } = commandData;
    if (
      msg.startsWith("!title") &&
      (context.badges?.broadcaster === "1" || context.mod)
    ) {
      this.eventEmitter.emit("CHANGE_STREAM_TITLE", {
        streamTitle: msg.replace("!title ", ""),
      });
    }
    if (
      msg.startsWith("!topic") &&
      (context.badges?.broadcaster === "1" || context.mod)
    ) {
      this.eventEmitter.emit("CHANGE_STREAM_TOPIC", {
        streamTopic: msg.replace("!topic ", ""),
      });
    }
  }
}
