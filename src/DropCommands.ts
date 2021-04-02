import Randomizer from "./Randomizer";
import TwitchChatClient from "./TwitchChatClient";
import ICommandData from "./interfaces/ICommandData";

interface Score {
  username: string;
  score: number;
}

const FIELD_WIDTH = 1080;
const DROP_ZONE_WIDTH = 100;

export default class DropCommands {
  randomizer: Randomizer;
  twitchClient: TwitchChatClient;

  currentGame: {
    drops: Map<string, Score>;
    dropZone: number;
  };

  constructor(randomizer: Randomizer, twitchClient: TwitchChatClient) {
    this.randomizer = randomizer;
    this.twitchClient = twitchClient;

    this.currentGame = {
      drops: new Map(),
      dropZone: 0,
    };
  }

  process(commandData: ICommandData) {
    const {
      message: { message: msg, channel },
    } = commandData;

    if (msg.toLowerCase().indexOf("!drop") !== 0) {
      return;
    }

    if (!commandData.user) {
      return;
    }

    //if (this.currentGame.drops.has(commandData.user?.username)) {
    //  return;
    //}

    const precision = 100;
    const dropResult =
      Math.floor(
        this.randomizer.getRandomValue() *
          (FIELD_WIDTH * precision - 1 * precision) +
          1 * precision
      ) /
      (1 * precision);

    const landingPosition = parseFloat(dropResult.toFixed(2));

    if (
      landingPosition >= this.currentGame.dropZone &&
      landingPosition <= this.currentGame.dropZone + DROP_ZONE_WIDTH
    ) {
      const score = landingPosition - this.currentGame.dropZone;
      this.twitchClient.say(
        channel,
        `${commandData?.user?.display_name} your drop score is ${score.toFixed(
          2
        )}`
      );
    } else {
      this.twitchClient.say(
        channel,
        `${commandData?.user?.display_name} you missed the drop zone :(`
      );
    }

    this.currentGame.drops.set(commandData.user.username, {
      username: commandData.user.username,
      score: landingPosition,
    });
  }
}
