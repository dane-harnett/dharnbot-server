import TwitchChatClient from "./TwitchChatClient";
import ICommandData from "./interfaces/ICommandData";

export default class ReplyCommands {
  twitchClient: TwitchChatClient;
  constructor(twitchClient: TwitchChatClient) {
    this.twitchClient = twitchClient;
  }
  process(commandData: ICommandData) {
    const {
      message: { message: msg, channel, context },
    } = commandData;

    if (msg === "!twitter") {
      this.twitchClient.say(channel, "https://www.twitter.com/daneharnett");
    }
    if (msg === "!youtube") {
      this.twitchClient.say(
        channel,
        "https://www.youtube.com/user/daneharnett"
      );
    }
    if (msg === "!youdoneyet repo") {
      this.twitchClient.say(
        channel,
        "https://github.com/dane-harnett/youdoneyet"
      );
    }
    if (msg === "!youdoneyet app") {
      this.twitchClient.say(
        channel,
        "https://youdoneyet.vercel.app/ is the production URL for You Done Yet"
      );
    }
    if (msg === "!dharnbot repo") {
      this.twitchClient.say(
        channel,
        "https://github.com/dane-harnett/dharnbot-server and https://github.com/dane-harnett/dharnbot-client"
      );
    }
    if (msg === "!miro") {
      this.twitchClient.say(
        channel,
        "https://miro.com/app/board/o9J_kqWtSsI=/"
      );
    }

    if (msg === "!schedule") {
      this.twitchClient.say(
        channel,
        "I stream in AEST / GMT+10 timezone. Friday 1800, Saturday 1200, Sunday 1200"
      );
    }

    if (
      msg.substring(0, 4) === "!so " &&
      (context.badges?.broadcaster === "1" || context.mod)
    ) {
      const username = msg.split(" ")[1];
      this.twitchClient.say(
        channel,
        `Shoutout to friend of the stream - ${username} over at https://twitch.tv/${username}!`
      );
    }
  }
}
