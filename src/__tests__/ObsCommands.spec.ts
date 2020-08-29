import ObsClient from "../ObsClient";
import ObsCommands from "../ObsCommands";

describe("twitch obs commands", () => {
  it("moves the cam to top-left", async () => {
    const obsClient = ObsClient.createNull();
    const twitchObs = new ObsCommands(obsClient);
    const commandData = {
      message: {
        channel: "channel",
        context: { mod: false, username: "username" },
        message: "!cam top-left",
      },
    };
    await twitchObs.process(commandData);
    const sceneName = "Info Bar Top";
    const itemName = "Webcam";
    const props = obsClient.getSceneItemProperties(sceneName, itemName);

    expect(props.position.x).toBe(0);
    expect(props.position.y).toBe(0);
  });
  it("moves the cam to top-right", async () => {
    const obsClient = ObsClient.createNull();
    const twitchObs = new ObsCommands(obsClient);
    const commandData = {
      message: {
        channel: "channel",
        context: { mod: false, username: "username" },
        message: "!cam top-right",
      },
    };
    await twitchObs.process(commandData);
    const sceneName = "Info Bar Top";
    const itemName = "Webcam";
    const props = obsClient.getSceneItemProperties(sceneName, itemName);

    expect(props.position.x).toBe(1920 - 400);
    expect(props.position.y).toBe(0);
  });
  it("moves the cam to bottom-left", async () => {
    const obsClient = ObsClient.createNull();
    const twitchObs = new ObsCommands(obsClient);
    const commandData = {
      message: {
        channel: "channel",
        context: { mod: false, username: "username" },
        message: "!cam bottom-left",
      },
    };
    await twitchObs.process(commandData);
    const sceneName = "Info Bar Top";
    const itemName = "Webcam";
    const props = obsClient.getSceneItemProperties(sceneName, itemName);

    expect(props.position.x).toBe(0);
    expect(props.position.y).toBe(1080 - 225);
  });
  it("moves the cam to bottom-right", async () => {
    const obsClient = ObsClient.createNull();
    const twitchObs = new ObsCommands(obsClient);
    const commandData = {
      message: {
        channel: "channel",
        context: { mod: false, username: "username" },
        message: "!cam bottom-right",
      },
    };
    await twitchObs.process(commandData);
    const sceneName = "Info Bar Top";
    const itemName = "Webcam";
    const props = obsClient.getSceneItemProperties(sceneName, itemName);

    expect(props.position.x).toBe(1920 - 400);
    expect(props.position.y).toBe(1080 - 225);
  });

  it("zooms the cam to 100%", async () => {
    const obsClient = ObsClient.createNull();
    const twitchObs = new ObsCommands(obsClient);
    const commandData = {
      message: {
        channel: "channel",
        context: { mod: false, username: "username" },
        message: "!cam zoom 100%",
      },
    };
    await twitchObs.process(commandData);
    const sceneName = "Info Bar Top";
    const itemName = "Webcam";
    const props = obsClient.getSceneItemProperties(sceneName, itemName);

    expect(props).toEqual({
      crop: { bottom: 0, left: 0, right: 0, top: 0 },
      scale: { x: 0.20833333333333334, y: 0.20833333333333334 },
      sourceHeight: 1080,
      sourceWidth: 1920,
    });
  });

  it("zooms the cam to 150%", async () => {
    const obsClient = ObsClient.createNull();
    const twitchObs = new ObsCommands(obsClient);
    const commandData = {
      message: {
        channel: "channel",
        context: { mod: false, username: "username" },
        message: "!cam zoom 150%",
      },
    };
    await twitchObs.process(commandData);
    const sceneName = "Info Bar Top";
    const itemName = "Webcam";
    const props = obsClient.getSceneItemProperties(sceneName, itemName);

    expect(props).toEqual({
      crop: { bottom: 180, left: 320, right: 320, top: 180 },
      scale: { x: 0.3125, y: 0.3125 },
      sourceHeight: 1080,
      sourceWidth: 1920,
    });
  });

  it("zooms the cam to 200%", async () => {
    const obsClient = ObsClient.createNull();
    const twitchObs = new ObsCommands(obsClient);
    const commandData = {
      message: {
        channel: "channel",
        context: { mod: false, username: "username" },
        message: "!cam zoom 200%",
      },
    };
    await twitchObs.process(commandData);
    const sceneName = "Info Bar Top";
    const itemName = "Webcam";
    const props = obsClient.getSceneItemProperties(sceneName, itemName);

    expect(props).toEqual({
      crop: { bottom: 270, left: 480, right: 480, top: 270 },
      scale: { x: 0.4166666666666667, y: 0.4166666666666667 },
      sourceHeight: 1080,
      sourceWidth: 1920,
    });
  });
  it("turns the cam on", async () => {
    const obsClient = ObsClient.createNull();
    const twitchObs = new ObsCommands(obsClient);
    const commandData = {
      message: {
        channel: "channel",
        context: { mod: false, username: "username" },
        message: "!cam on",
      },
    };
    await twitchObs.process(commandData);
    const sceneName = "Info Bar Top";
    const itemName = "Webcam";
    const props = obsClient.getSceneItemProperties(sceneName, itemName);

    expect(props).toEqual({
      sourceHeight: 1080,
      sourceWidth: 1920,
      visible: true,
    });
  });
  it("turns the cam off", async () => {
    const obsClient = ObsClient.createNull();
    const twitchObs = new ObsCommands(obsClient);
    const commandData = {
      message: {
        channel: "channel",
        context: { mod: false, username: "username" },
        message: "!cam off",
      },
    };
    await twitchObs.process(commandData);
    const sceneName = "Info Bar Top";
    const itemName = "Webcam";
    const props = obsClient.getSceneItemProperties(sceneName, itemName);

    expect(props).toEqual({
      sourceHeight: 1080,
      sourceWidth: 1920,
      visible: false,
    });
  });
});
