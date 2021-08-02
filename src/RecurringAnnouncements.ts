import EventEmitter from "./EventEmitter";
import TwitchChatClient from "./TwitchChatClient";
import RecurringAnnouncementsConfig from "../config/RecurringAnnouncementsConfig";

interface Announcement {
  name: string;
  interval: number;
  message: string | ((seed: number) => string);
}

interface RecurringAnnouncementsConfig {
  announcements: Announcement[];
}

export default class RecurringAnnouncements {
  eventEmitter: EventEmitter;
  twitchClient: TwitchChatClient;
  config: RecurringAnnouncementsConfig;
  channel: string;
  wasLastMessageRecurringAnnouncement: boolean;
  seed: number;

  constructor(
    eventEmitter: EventEmitter,
    twitchClient: TwitchChatClient,
    channel: string
  ) {
    this.eventEmitter = eventEmitter;
    this.twitchClient = twitchClient;
    this.config = RecurringAnnouncementsConfig;
    this.channel = channel;
    this.wasLastMessageRecurringAnnouncement = false;
    this.seed = -1;

    if (this.channel === "") {
      return;
    }

    this.eventEmitter.on("MESSAGE", () => {
      this.wasLastMessageRecurringAnnouncement = false;
    });
  }

  start() {
    this.config.announcements.forEach((a) => {
      setInterval(() => {
        if (this.wasLastMessageRecurringAnnouncement) {
          return;
        }
        this.seed++;
        const msg =
          typeof a.message === "string" ? a.message : a.message(this.seed);
        this.twitchClient.say(this.channel, msg);
        this.wasLastMessageRecurringAnnouncement = true;
      }, a.interval * 1000);
    });
  }
}
