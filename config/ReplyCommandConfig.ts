export default {
  commands: [
    {
      command: "!project",
      message:
        "I'm working on Opposable - The Thumbnail Builder - using TypeScript, Electron and React, or I'm working on my stream (chatbot, overlays, etc)",
    },
    {
      command: "!today",
      message:
        "I'm adding more configuration to DHARNBOT my twitch chatbot and overlay tool.",
    },
    {
      command: "!beats",
      aliases: ["!music", "!song", "!songs"],
      message: "I currently playing Streambeats by Harris Heller",
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
      command: "!miro",
      message: "https://miro.com/app/board/o9J_kqWtSsI=/",
    },
    {
      command: "!schedule",
      message:
        "I stream in AEST / GMT+10 timezone. Friday 1800, Saturday 1200, Sunday 1200",
    },
    {
      command: (msg: string) => msg.startsWith("!so "),
      requireMod: true,
      message: (msg: string) => {
        const username = msg.split(" ")[1];
        return `Shoutout to friend of the stream - ${username} over at https://twitch.tv/${username}!`;
      },
    },
  ],
};
