import TwitchChatClient from "../TwitchChatClient";
import InfoCommands from "../InfoCommands";
import EventEmitter from "../EventEmitter";

const createInfoCommands = () => {
  const twitchChatClient = TwitchChatClient.createNull();
  const eventEmitter = EventEmitter.createNull();
  const infoCommands = new InfoCommands(twitchChatClient, eventEmitter);
  return {
    eventEmitter,
    infoCommands,
    twitchChatClient,
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

  it("responds with the dharnbot github link", () => {
    const { infoCommands, twitchChatClient } = createInfoCommands();
    const commandData = {
      message: {
        channel: "channel",
        context: { mod: false, username: "username" },
        message: "!dharnbot repo",
      },
    };
    infoCommands.process(commandData);

    expect(twitchChatClient.getLastResponse()?.channel).toBe("channel");
    expect(twitchChatClient.getLastResponse()?.message).toBe(
      "https://github.com/dane-harnett/dharnbot-server and https://github.com/dane-harnett/dharnbot-client"
    );
  });

  it("responds with my miro link", () => {
    const { infoCommands, twitchChatClient } = createInfoCommands();
    const commandData = {
      message: {
        channel: "channel",
        context: { mod: false, username: "username" },
        message: "!miro",
      },
    };
    infoCommands.process(commandData);

    expect(twitchChatClient.getLastResponse()?.channel).toBe("channel");
    expect(twitchChatClient.getLastResponse()?.message).toBe(
      "https://miro.com/app/board/o9J_kqWtSsI=/"
    );
  });
});
