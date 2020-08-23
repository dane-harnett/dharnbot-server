import TwitchChatClient from "./TwitchChatClient";

export default class InfoCommands {
  twitchClient: TwitchChatClient;
  constructor(twitchClient: TwitchChatClient) {
    this.twitchClient = twitchClient;
  }
  process(
    channel: string,
    tags: { badges?: { broadcaster: "1" | "0" }; mod: boolean },
    msg: string,
    _self: boolean
  ) {
    if (msg === "!project") {
      this.twitchClient.say(
        channel,
        "I'm building a twitch chatbot with commands to integrate with OBS, games and more. I'll be using TypeScript, Express and Jest."
      );
    }
    if (msg === "!github") {
      this.twitchClient.say(
        channel,
        "https://github.com/dane-harnett/dharnbot-server"
      );
    }
    if (msg === "!miro") {
      this.twitchClient.say(
        channel,
        "https://miro.com/app/board/o9J_kqWtSsI=/"
      );
    }
    if (msg === "!youdoneyet") {
      this.twitchClient.say(
        channel,
        "https://youdoneyet.vercel.app/ is the production URL for You Done Yet"
      );
    }
    if (msg === "!youtube") {
      this.twitchClient.say(
        channel,
        "https://www.youtube.com/channel/UClyesSRrwmQ_LDlxanwVRHg"
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
      (tags.badges?.broadcaster === "1" || tags.mod)
    ) {
      const username = msg.split(" ")[1];
      this.twitchClient.say(
        channel,
        `Shoutout to friend of the stream - ${username} over at https://twitch.tv/${username}!`
      );
    }
  }
}
