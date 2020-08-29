import TwitchChatClient from "./TwitchChatClient";
import ICommandData from "./interfaces/ICommandData";
import ReplyCommandConfig from "../config/ReplyCommandConfig";

interface ReplyCommandConfig {
  command: string | ((msg: string) => boolean);
  message: string | ((msg: string) => string);
  requireMod?: boolean;
}
export default class ReplyCommands {
  twitchClient: TwitchChatClient;
  commands: ReplyCommandConfig[];

  constructor(twitchClient: TwitchChatClient) {
    this.twitchClient = twitchClient;
    this.commands = ReplyCommandConfig.commands;
  }

  process(commandData: ICommandData) {
    const {
      message: { message: msg, channel, context },
    } = commandData;

    this.commands.forEach((command) => {
      if (
        command.requireMod &&
        !(context.badges?.broadcaster === "1" || context.mod)
      ) {
        return;
      }

      if (typeof command.command === "string" && command.command === msg) {
        if (typeof command.message === "string") {
          this.twitchClient.say(channel, command.message);
          return;
        }
        if (typeof command.message === "function") {
          this.twitchClient.say(channel, command.message(msg));
          return;
        }
      }

      if (typeof command.command === "function" && command.command(msg)) {
        if (typeof command.message === "string") {
          this.twitchClient.say(channel, command.message);
          return;
        }
        if (typeof command.message === "function") {
          this.twitchClient.say(channel, command.message(msg));
          return;
        }
      }
    });
  }
}