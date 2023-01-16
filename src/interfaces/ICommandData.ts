import type { ChatUserstate } from "tmi.js";

export default interface ICommandData {
  message: {
    channel: string;
    context: ChatUserstate;
    message: string;
  };
  user?: {
    display_name: string;
    login: string;
    profile_image_url: string;
  };
}
