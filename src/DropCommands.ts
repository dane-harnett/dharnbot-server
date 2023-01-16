import Randomizer from "./Randomizer";
import TwitchChatClient from "./TwitchChatClient";
import ICommandData from "./interfaces/ICommandData";

interface Score {
  login: string;
  score: number;
}

interface IdleGame {
  status: "IDLE";
}

interface ActiveGame {
  status: "ACTIVE";
  channel: string;
  drops: Map<string, Score>;
  dropZone: number;
}

const FIELD_WIDTH = 1080;
const DROP_ZONE_WIDTH = 201;
const GAME_IDLE_RESET_TIME = 20 * 1000;

export default class DropCommands {
  randomizer: Randomizer;
  twitchClient: TwitchChatClient;
  currentGame: IdleGame | ActiveGame;
  resetTimeout: undefined | ReturnType<typeof setTimeout>;

  constructor(randomizer: Randomizer, twitchClient: TwitchChatClient) {
    this.randomizer = randomizer;
    this.twitchClient = twitchClient;
    this.resetTimeout = undefined;
    this.currentGame = {
      status: "IDLE",
    };
  }

  startGame(channel: string) {
    const dropZone = Math.floor(
      this.randomizer.getRandomValue() * (FIELD_WIDTH - DROP_ZONE_WIDTH)
    );
    this.currentGame = {
      status: "ACTIVE",
      channel,
      drops: new Map(),
      dropZone,
    };
  }

  resetGame() {
    if (this.currentGame.status === "ACTIVE") {
      this.twitchClient.say(
        this.currentGame.channel,
        "The drop game has reset"
      );
      this.currentGame = {
        status: "IDLE",
      };
    }
  }

  processDrop(commandData: ICommandData) {
    const {
      message: { channel, context },
    } = commandData;

    if (!commandData.user) {
      return;
    }

    if (this.currentGame.status === "IDLE") {
      this.startGame(channel);
    }

    if (this.currentGame.status === "ACTIVE") {
      if (
        context.badges?.broadcaster === "0" &&
        this.currentGame.drops.has(commandData.user?.login)
      ) {
        return;
      }

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
        const midPoint = this.currentGame.dropZone + 100;
        let lhs, rhs;
        if (landingPosition < midPoint) {
          lhs = midPoint;
          rhs = landingPosition;
        } else {
          rhs = midPoint;
          lhs = landingPosition;
        }

        const score = 100 - (lhs - rhs);

        this.twitchClient.say(
          channel,
          `${
            commandData?.user?.display_name
          } your drop score is ${score.toFixed(2)}`
        );
      } else {
        this.twitchClient.say(
          channel,
          `${commandData?.user?.display_name} you missed the drop zone :(`
        );
      }

      this.currentGame.drops.set(commandData.user.login, {
        login: commandData.user.login,
        score: landingPosition,
      });

      if (this.resetTimeout !== undefined) {
        clearTimeout(this.resetTimeout);
      }
      this.resetTimeout = setTimeout(() => {
        this.resetGame();
      }, GAME_IDLE_RESET_TIME);
    }
  }

  process(commandData: ICommandData) {
    const {
      message: { message: msg },
    } = commandData;

    if (msg.toLowerCase().indexOf("!drop") === 0) {
      this.processDrop(commandData);
      return;
    }
  }

  getCommandInfoList() {
    return ["!drop"];
  }
}
