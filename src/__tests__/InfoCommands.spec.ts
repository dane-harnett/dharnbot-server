import TwitchChatClient from "../TwitchChatClient";
import InfoCommands from "../InfoCommands";

describe("twitch info commands", () => {
  it("responds with the current project", () => {
    const twitchClient = TwitchChatClient.createNull();
    const twitchInfo = new InfoCommands(twitchClient);
    twitchInfo.process("channel", { mod: false }, "!project", false);

    expect(twitchClient.getLastResponse()?.channel).toBe("channel");
    expect(twitchClient.getLastResponse()?.message).toBe(
      "I'm building a twitch chatbot with commands to integrate with OBS, games and more. I'll be using TypeScript, Express and Jest."
    );
  });

  it("responds with my github link", () => {
    const twitchClient = TwitchChatClient.createNull();
    const twitchInfo = new InfoCommands(twitchClient);
    twitchInfo.process("channel", { mod: false }, "!github", false);

    expect(twitchClient.getLastResponse()?.channel).toBe("channel");
    expect(twitchClient.getLastResponse()?.message).toBe(
      "https://github.com/dane-harnett/dharnbot-server"
    );
  });

  it("responds with my miro link", () => {
    const twitchClient = TwitchChatClient.createNull();
    const twitchInfo = new InfoCommands(twitchClient);
    twitchInfo.process("channel", { mod: false }, "!miro", false);

    expect(twitchClient.getLastResponse()?.channel).toBe("channel");
    expect(twitchClient.getLastResponse()?.message).toBe(
      "https://miro.com/app/board/o9J_kqWtSsI=/"
    );
  });
});
