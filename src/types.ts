import DropCommands from "./DropCommands";
import HighlightedMessageCommands from "./HighlightedMessageCommands";
import InfoCommands from "./InfoCommands";
import ObsCommands from "./ObsCommands";
import ReplyCommands from "./ReplyCommands";
import StreamDetailsCommands from "./StreamDetailsCommands";

export type CommandProcessors = Array<
  | ReplyCommands
  | DropCommands
  | HighlightedMessageCommands
  | InfoCommands
  | ObsCommands
  | StreamDetailsCommands
>;
