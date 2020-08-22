import TwitchChatClient from "./TwitchChatClient";

export default class InfoCommands {
  twitchClient: TwitchChatClient;
  constructor(twitchClient: TwitchChatClient) {
    this.twitchClient = twitchClient;
  }
  process(channel: string, _tags: string, msg: string, _self: boolean) {
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
  }
}
