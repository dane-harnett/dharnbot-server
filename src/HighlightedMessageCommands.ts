import EventEmitter from "./EventEmitter";
import ICommandData from "./interfaces/ICommandData";

export default class HighlightedMessageCommands {
  eventEmitter: EventEmitter;
  constructor(eventEmitter: EventEmitter) {
    this.eventEmitter = eventEmitter;
  }

  process(commandData: ICommandData) {
    if (commandData.message.context["msg-id"] !== "highlighted-message") {
      return;
    }

    this.eventEmitter.emit("HIGHLIGHTED_MESSAGE", commandData);
  }

  getCommandInfoList() {
    return [];
  }
}
