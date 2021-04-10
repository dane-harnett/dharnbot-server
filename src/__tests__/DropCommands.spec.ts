import Randomizer from "../Randomizer";
import TwitchChatClient from "../TwitchChatClient";
import DropCommands from "../DropCommands";

const createDropCommands = (randomValue: number) => {
  const randomizer = Randomizer.createNull(randomValue);
  const twitchChatClient = TwitchChatClient.createNull();
  const dropCommands = new DropCommands(randomizer, twitchChatClient);
  return {
    dropCommands,
    randomizer,
    twitchChatClient,
  };
};

describe("drop commands", () => {
  it("!drop message replies with a score", () => {
    const { dropCommands, twitchChatClient } = createDropCommands(0);
    const commandData = {
      message: {
        channel: "channel",
        context: { mod: false, username: "username" },
        message: "!drop",
      },
      user: {
        display_name: "test display_name",
        profile_image_url: "test profile_image_url",
        login: "test username",
      },
    };
    dropCommands.process(commandData);

    expect(twitchChatClient.getLastResponse()?.channel).toBe("channel");
    expect(twitchChatClient.getLastResponse()?.message).toBe(
      "test display_name your drop score is 1.00"
    );
  });
});
