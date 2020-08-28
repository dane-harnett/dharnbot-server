import InfoCommands from "../InfoCommands";
import EventEmitter from "../EventEmitter";

const createInfoCommands = () => {
  const eventEmitter = EventEmitter.createNull();
  const infoCommands = new InfoCommands(eventEmitter);
  return {
    eventEmitter,
    infoCommands,
  };
};

describe("twitch info commands", () => {
  it("notifies the user interface of the project info panel event", () => {
    const { eventEmitter, infoCommands } = createInfoCommands();
    const commandData = {
      message: {
        channel: "channel",
        context: { mod: false, username: "username" },
        message: "!project",
      },
    };
    infoCommands.process(commandData);

    expect(eventEmitter.getLastEmitted()).toEqual([
      "INFO_PANEL",
      [{ panel: "!project" }],
    ]);
  });
});
