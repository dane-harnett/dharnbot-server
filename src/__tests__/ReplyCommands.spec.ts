import TwitchChatClient from "../TwitchChatClient";
import ReplyCommands from "../ReplyCommands";

const createReplyCommands = () => {
  const twitchChatClient = TwitchChatClient.createNull();
  const replyCommands = new ReplyCommands(twitchChatClient);
  return {
    replyCommands,
    twitchChatClient,
  };
};

describe("reply commands", () => {
  it("responds with the dharnbot github link", () => {
    const { replyCommands, twitchChatClient } = createReplyCommands();
    const commandData = {
      message: {
        channel: "channel",
        context: { mod: false, username: "username" },
        message: "!dharnbot repo",
      },
    };
    replyCommands.process(commandData);

    expect(twitchChatClient.getLastResponse()?.channel).toBe("channel");
    expect(twitchChatClient.getLastResponse()?.message).toBe(
      "https://github.com/dane-harnett/dharnbot-server and https://github.com/dane-harnett/dharnbot-client"
    );
  });

  it("responds with my miro link", () => {
    const { replyCommands, twitchChatClient } = createReplyCommands();
    const commandData = {
      message: {
        channel: "channel",
        context: { mod: false, username: "username" },
        message: "!miro",
      },
    };
    replyCommands.process(commandData);

    expect(twitchChatClient.getLastResponse()?.channel).toBe("channel");
    expect(twitchChatClient.getLastResponse()?.message).toBe(
      "https://miro.com/app/board/o9J_kqWtSsI=/"
    );
  });
});
