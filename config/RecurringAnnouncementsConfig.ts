export default {
  announcements: [
    {
      name: "Discord invite",
      interval: 300,
      message: (seed: number) => {
        const msgs = [
          "Want to discuss more outside of the live stream? Join our discord https://discord.gg/MBJ8bhN",
          "Check my YouTube channel for software development tutorial content https://youtube.com/daneharnett",
          "Sometimes I also use Twitter https://twitter.com/daneharnett",
        ];
        return msgs[seed % msgs.length];
      },
    },
  ],
};
