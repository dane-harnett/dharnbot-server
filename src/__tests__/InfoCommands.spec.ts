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
    infoCommands.process("channel", { mod: false }, "!project", false);

    expect(eventEmitter.getLastEmitted()).toEqual([
      "INFO_PANEL",
      [{ panel: "!project" }],
    ]);
  });

  it("responds with the dharnbot github link", () => {
    const { infoCommands, twitchChatClient } = createInfoCommands();
    infoCommands.process("channel", { mod: false }, "!dharnbot repo", false);

    expect(twitchChatClient.getLastResponse()?.channel).toBe("channel");
    expect(twitchChatClient.getLastResponse()?.message).toBe(
      "https://github.com/dane-harnett/dharnbot-server"
    );
  });

  it("responds with my miro link", () => {
    const { infoCommands, twitchChatClient } = createInfoCommands();
    infoCommands.process("channel", { mod: false }, "!miro", false);

    expect(twitchChatClient.getLastResponse()?.channel).toBe("channel");
    expect(twitchChatClient.getLastResponse()?.message).toBe(
      "https://miro.com/app/board/o9J_kqWtSsI=/"
    );
  });
});
