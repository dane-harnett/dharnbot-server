export default {
  commands: [
    {
      command: "!project",
      message:
        "I'm working on Opposable - The Thumbnail Builder - using TypeScript, Electron and React, or I'm working on my stream (chatbot, overlays, etc)",
    },
    {
      command: "!today",
      aliases: ["!whatscrackin"],
      message:
        "Today I'm adding the ability to save and load projects in Opposable",
    },
    {
      command: "!beats",
      aliases: ["!music", "!song", "!songs"],
      message: "I currently playing Soundtrack by Twitch",
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
      message: "Update this",
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
  ],
};
