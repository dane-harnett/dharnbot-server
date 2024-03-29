import TwitchChatClient from "./TwitchChatClient";
import ICommandData from "./interfaces/ICommandData";
import ReplyCommandConfig from "../config/ReplyCommandConfig";

export interface CommandConfiguration {
  aliases?: Array<string>;
  command: string | ((msg: string) => boolean);
  info?: string;
  message:
    | string
    | ((
        msg: string,
        cmd: CommandConfiguration,
        commandData: ICommandData
      ) => string);
  requireMod?: boolean;
}

export interface Configuration {
  commands: CommandConfiguration[];
}

export default class ReplyCommands {
  twitchClient: TwitchChatClient;
  commands: CommandConfiguration[];

  constructor(twitchClient: TwitchChatClient) {
    this.twitchClient = twitchClient;
    this.commands = ReplyCommandConfig.commands;
  }

  getCommandInfoList(): string[] {
    return this.commands.map((rpc) => {
      if (typeof rpc.command === "string") {
        return rpc.command;
      }
      return rpc.info || "";
    });
  }

  process(commandData: ICommandData): void {
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

      // handle "string" commands
      if (
        (typeof command.command === "string" &&
          command.command.trim().toLowerCase() === msg.trim().toLowerCase()) ||
        (Array.isArray(command.aliases) && command.aliases.includes(msg))
      ) {
        if (typeof command.message === "string") {
          // console.log(`DEBUG: matched command ${command.command} msg=${msg}`);
          this.twitchClient.say(channel, command.message);
          return;
        }
        if (typeof command.message === "function") {
          this.twitchClient.say(
            channel,
            command.message(msg, command, commandData)
          );
          return;
        }
      }

      // handle "function" commands
      if (typeof command.command === "function" && command.command(msg)) {
        if (typeof command.message === "string") {
          this.twitchClient.say(channel, command.message);
          return;
        }
        if (typeof command.message === "function") {
          this.twitchClient.say(
            channel,
            command.message(msg, command, commandData)
          );
          return;
        }
      }
    });
  }
}
