import TwitchChatClient from "./TwitchChatClient";
// import { EventEmitter } from "events";
import EventEmitter from "./EventEmitter";

export default class InfoCommands {
  twitchClient: TwitchChatClient;
  eventEmitter: EventEmitter;
  constructor(twitchClient: TwitchChatClient, eventEmitter: EventEmitter) {
    this.twitchClient = twitchClient;
    this.eventEmitter = eventEmitter;
  }
  process(
    channel: string,
    tags: { badges?: { broadcaster: "1" | "0" }; mod: boolean },
    msg: string,
    _self: boolean
  ) {
    if (msg === "!project") {
      this.eventEmitter.emit("INFO_PANEL", { panel: "!project" });
    }
    if (msg === "!today") {
      this.eventEmitter.emit("INFO_PANEL", { panel: "!today" });
    }
    if (msg === "!socials") {
      this.eventEmitter.emit("INFO_PANEL", { panel: "!socials" });
    }
    if (msg === "!twitter") {
      this.twitchClient.say(channel, "https://www.twitter.com/daneharnett");
    }
    if (msg === "!youtube") {
      this.twitchClient.say(
        channel,
        "https://www.youtube.com/user/daneharnett"
      );
    }
    if (msg === "!cam") {
      this.eventEmitter.emit("INFO_PANEL", { panel: "!cam" });
    }
    if (msg === "!youdoneyet") {
      this.eventEmitter.emit("INFO_PANEL", { panel: "!youdoneyet" });
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
    if (msg === "!dharnbot") {
      this.eventEmitter.emit("INFO_PANEL", { panel: "!dharnbot" });
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
