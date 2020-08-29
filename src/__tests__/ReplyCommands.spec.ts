import TwitchChatClient from "../TwitchChatClient";
import ReplyCommands from "../ReplyCommands";

jest.mock("../../config/ReplyCommandConfig", () => {
  return {
    commands: [
      {
        command: "!example-command",
        message: "example message",
      },
    ],
  };
});

const createReplyCommands = () => {
  const twitchChatClient = TwitchChatClient.createNull();
  const replyCommands = new ReplyCommands(twitchChatClient);
  return {
    replyCommands,
    twitchChatClient,
  };
};

describe("reply commands", () => {
  it("responds with the example message", () => {
    const { replyCommands, twitchChatClient } = createReplyCommands();
    const commandData = {
      message: {
        channel: "channel",
        context: { mod: false, username: "username" },
        message: "!example-command",
      },
    };
    replyCommands.process(commandData);

    expect(twitchChatClient.getLastResponse()?.channel).toBe("channel");
    expect(twitchChatClient.getLastResponse()?.message).toBe("example message");
  });
});
