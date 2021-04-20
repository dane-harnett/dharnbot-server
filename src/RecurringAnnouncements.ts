import TwitchChatClient from "./TwitchChatClient";
import RecurringAnnouncementsConfig from "../config/RecurringAnnouncementsConfig";

interface Announcement {
  name: string;
  interval: number;
  message: string;
}

interface RecurringAnnouncementsConfig {
  announcements: Announcement[];
}

export default class RecurringAnnouncements {
  twitchClient: TwitchChatClient;
  config: RecurringAnnouncementsConfig;
  channel: string;

  constructor(twitchClient: TwitchChatClient, channel: string) {
    this.twitchClient = twitchClient;
    this.config = RecurringAnnouncementsConfig;
    this.channel = channel;

    if (this.channel === "") {
      return;
    }
  }

  start() {
    this.config.announcements.forEach((a) => {
      setInterval(() => {
        this.twitchClient.say(this.channel, a.message);
      }, a.interval * 1000);
    });
  }
}
