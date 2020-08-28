import EventEmitter from "./EventEmitter";
import ICommandData from "./interfaces/ICommandData";

export default class InfoCommands {
  eventEmitter: EventEmitter;
  constructor(eventEmitter: EventEmitter) {
    this.eventEmitter = eventEmitter;
  }
  process(commandData: ICommandData) {
    const {
      message: { message: msg },
    } = commandData;

    if (msg === "!project") {
      this.eventEmitter.emit("INFO_PANEL", { panel: "!project" });
    }
    if (msg === "!today") {
      this.eventEmitter.emit("INFO_PANEL", { panel: "!today" });
    }
    if (msg === "!socials") {
      this.eventEmitter.emit("INFO_PANEL", { panel: "!socials" });
    }
    if (msg === "!cam") {
      this.eventEmitter.emit("INFO_PANEL", { panel: "!cam" });
    }
    if (msg === "!youdoneyet") {
      this.eventEmitter.emit("INFO_PANEL", { panel: "!youdoneyet" });
    }
    if (msg === "!dharnbot") {
      this.eventEmitter.emit("INFO_PANEL", { panel: "!dharnbot" });
    }
  }
}
