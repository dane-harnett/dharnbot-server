import ReplyCommandConfigCustom from "./ReplyCommandConfigCustom";
import { CommandConfiguration, Configuration } from "../src/ReplyCommands";

const commands: CommandConfiguration[] = [
  {
    command: "!pomo",
    message:
      "During coworking streams I'll be working with the pomodoro technique with 30 min timer of focused work and 5-10 mins of break and chat interaction.",
  },
  {
    command: "!values",
    message:
      "Growth and Excellence - I try to live my live by trying to learn as much as I can, and then trying to be the best at whatever I take on.",
  },
  {
    command: "!beats",
    aliases: ["!music", "!song", "!songs"],
    message: "I'm currently playing Streambeats",
  },
  {
    command: "!twitter",
    message: "https://www.twitter.com/daneharnett",
  },
  {
    command: "!youtube",
    aliases: ["!yt"],
    message: "https://www.youtube.com/daneharnett",
  },
  {
    command: "!github",
    aliases: ["!gh"],
    message: "https://github.com/dane-harnett",
  },
  {
    command: "!youdoneyet repo",
    message: "https://github.com/dane-harnett/youdoneyet",
  },
  {
    command: "!youdoneyet app",
    message:
      "https://youdoneyet.vercel.app/ is the production URL for You Done Yet",
  },
  {
    command: "!dharnbot repo",
    message:
      "https://github.com/dane-harnett/dharnbot-server and https://github.com/dane-harnett/dharnbot-client",
  },
  {
    command: "!opposable repo",
    message: "https://github.com/dane-harnett/opposable",
  },
  {
    command: "!miro",
    message: "https://miro.com/app/board/o9J_kqWtSsI=/",
  },
  {
    command: "!schedule",
    message: "Generally I stream Tue/Wed/Fri 5pm-7pm AEST",
  },
  {
    info: "!so {username}",
    command: (msg: string) => msg.startsWith("!so "),
    requireMod: true,
    message: (msg: string) => {
      const username = msg.split(" ")[1];
      return `Shoutout to friend of the stream - ${username} over at https://twitch.tv/${username}!`;
    },
  },
  {
    info: "!8ball {question}?",
    command: (msg: string) => msg.startsWith("!8ball") && msg.endsWith("?"),
    message: (_msg: string, _cmd: any) => {
      const random = Math.random();
      if (random > 0.5) {
        return "Yes";
      } else {
        return "No";
      }
    },
  },
  {
    command: "!discord",
    message: "https://discord.gg/MBJ8bhN",
  },
  {
    command: "!camera",
    message:
      "I'm borrowing my brother's Sony A7ii (with a Sony 28mm f2 lens), also I have a Logitech Streamcam",
  },
  {
    aliases: ["!mic", "!mike"],
    command: "!microphone",
    message:
      "I'm using a Blue Yeti Nano USB microphone, what do you think of the audio?",
  },
  {
    aliases: ["!dot", "!config"],
    command: "!dotfiles",
    message: "https://github.com/dane-harnett/dotfiles",
  },
  {
    command: "!project",
    message:
      "Dane works on various projects: !dharnbot, !opposable, !youdoneyet",
  },
  {
    command: "!dharnbot",
    message: "dharnbot is Dane's custom twitch chat bot: !dharnbot repo",
  },
  {
    command: "!opposable",
    message:
      "Opposable is a thumbnail builder [TypeScript|React|Electron]: !opposable repo",
  },
  {
    command: "!youdoneyet",
    message:
      "You Done Yet is a habit tracker [Next.js|TypeScript|GraphQL]: !youdoneyet repo",
  },
  {
    command: "!challenge",
    message:
      "No current community channel point challenge... If you have a suggestion, let me know!",
  },
  {
    command: "!lurk",
    message: "Thanks for the lurk, chat soon!",
  },
  {
    command: "!sunglasses",
    aliases: ["!sunnies"],
    message:
      "This ring light is bright so I wear Rayban RB4135 Justin Classic. Redeem the remove sunglasses channel point reward!",
  },
  {
    command: "!time",
    message: () => {
      return `The local time is ${Date().toLocaleString()}`;
    },
  },
];

const config: Configuration = {
  commands: commands.concat(ReplyCommandConfigCustom.commands),
};

export default config;
