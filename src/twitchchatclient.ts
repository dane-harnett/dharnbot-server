export default class TwitchChatClient {
  tmi: any;
  lastResponse: {
    channel: string;
    message: string;
  } | null;
  constructor(tmi: any) {
    this.tmi = tmi;
  }
  static createNull() {
    return new NullTwitchChatClient();
  }
  say(channel: string, message: string) {
    this.tmi.say(channel, message);
    this.lastResponse = {
      channel,
      message,
    };
  }
  getLastResponse() {
    return this.lastResponse;
  }
}

class NullTwitchChatClient extends TwitchChatClient {
  constructor() {
    super(null);
    this.lastResponse = null;
  }
  say(channel: string, message: string) {
    this.lastResponse = {
      channel,
      message,
    };
  }
  getLastResponse() {
    return this.lastResponse;
  }
}
