import TwitchChatClient from "../twitchchatclient";
import TwitchInfoCommands from "../twitchinfocommands";

describe("twitch info commands", () => {
  it("responds with the current project", () => {
    const twitchClient = TwitchChatClient.createNull();
    const twitchInfo = new TwitchInfoCommands(twitchClient);
    twitchInfo.process("channel", "", "!project", false);

    expect(twitchClient.getLastResponse()?.channel).toBe("channel");
    expect(twitchClient.getLastResponse()?.message).toBe(
      "I'm building a twitch chatbot with commands to integrate with OBS, games and more. I'll be using TypeScript, Express and Jest."
    );
  });

  it("responds with my github link", () => {
    const twitchClient = TwitchChatClient.createNull();
    const twitchInfo = new TwitchInfoCommands(twitchClient);
    twitchInfo.process("channel", "", "!github", false);

    expect(twitchClient.getLastResponse()?.channel).toBe("channel");
    expect(twitchClient.getLastResponse()?.message).toBe(
      "https://github.com/dane-harnett/dharnbot-server"
    );
  });
});
