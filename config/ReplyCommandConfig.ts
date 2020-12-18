export default {
  commands: [
    {
      command: "!project",
      message: "I'm building a game, what game? Not sure yet.",
    },
    {
      command: "!today",
      aliases: ["!whatscrackin"],
      message: "Wednesday Q&A - let's chat about coding stuff hooray!",
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
      message: "https://www.youtube.com/user/daneharnett",
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
      message: "Generally I stream Mon/Wed/Fri 5pm-7pm AEST",
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
      command: "!snake-most-concurrent",
      message: "5 - 2020-10-09",
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
      command: "!dotfiles",
      message: "https://github.com/dane-harnett/dotfiles",
    },
  ],
};
