export default interface ICommandData {
  message: {
    channel: string;
    context: {
      badges?: { broadcaster: "1" | "0" };
      mod: boolean;
      username: string;
    };
    message: string;
  };
  user?: {};
}
