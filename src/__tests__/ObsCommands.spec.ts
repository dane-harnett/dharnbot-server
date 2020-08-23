import ObsClient from "../ObsClient";
import ObsCommands from "../ObsCommands";

describe("twitch obs commands", () => {
  it("moves the cam to top-left", async () => {
    const obsClient = ObsClient.createNull();
    const twitchObs = new ObsCommands(obsClient);
    await twitchObs.process("channel", "", "!cam top-left", false);
    const sceneName = "Info Bar Top";
    const itemName = "Webcam";
    const props = obsClient.getSceneItemProperties(sceneName, itemName);

    expect(props.position.x).toBe(0);
    expect(props.position.y).toBe(80);
  });
  it("moves the cam to top-right", async () => {
    const obsClient = ObsClient.createNull();
    const twitchObs = new ObsCommands(obsClient);
    await twitchObs.process("channel", "", "!cam top-right", false);
    const sceneName = "Info Bar Top";
    const itemName = "Webcam";
    const props = obsClient.getSceneItemProperties(sceneName, itemName);

    expect(props.position.x).toBe(1920 - 400);
    expect(props.position.y).toBe(80);
  });
  it("moves the cam to bottom-left", async () => {
    const obsClient = ObsClient.createNull();
    const twitchObs = new ObsCommands(obsClient);
    await twitchObs.process("channel", "", "!cam bottom-left", false);
    const sceneName = "Info Bar Top";
    const itemName = "Webcam";
    const props = obsClient.getSceneItemProperties(sceneName, itemName);

    expect(props.position.x).toBe(0);
    expect(props.position.y).toBe(1080 - 225);
  });
  it("moves the cam to bottom-right", async () => {
    const obsClient = ObsClient.createNull();
    const twitchObs = new ObsCommands(obsClient);
    await twitchObs.process("channel", "", "!cam bottom-right", false);
    const sceneName = "Info Bar Top";
    const itemName = "Webcam";
    const props = obsClient.getSceneItemProperties(sceneName, itemName);

    expect(props.position.x).toBe(1920 - 400);
    expect(props.position.y).toBe(1080 - 225);
  });

  it("zooms the cam to 100%", async () => {
    const obsClient = ObsClient.createNull();
    const twitchObs = new ObsCommands(obsClient);
    await twitchObs.process("channel", "", "!cam zoom 100%", false);
    const sceneName = "Info Bar Top";
    const itemName = "Webcam";
    const props = obsClient.getSceneItemProperties(sceneName, itemName);

    expect(props).toEqual({
      crop: { bottom: 0, left: 0, right: 0, top: 0 },
      position: { x: 0, y: 855 },
      scale: { x: 0.20833333333333334, y: 0.20833333333333334 },
      sourceHeight: 1080,
      sourceWidth: 1920,
    });
  });

  it("zooms the cam to 150%", async () => {
    const obsClient = ObsClient.createNull();
    const twitchObs = new ObsCommands(obsClient);
    await twitchObs.process("channel", "", "!cam zoom 150%", false);
    const sceneName = "Info Bar Top";
    const itemName = "Webcam";
    const props = obsClient.getSceneItemProperties(sceneName, itemName);

    expect(props).toEqual({
      crop: { bottom: 180, left: 320, right: 320, top: 180 },
      position: { x: 0, y: 855 },
      scale: { x: 0.3125, y: 0.3125 },
      sourceHeight: 1080,
      sourceWidth: 1920,
    });
  });

  it("zooms the cam to 200%", async () => {
    const obsClient = ObsClient.createNull();
    const twitchObs = new ObsCommands(obsClient);
    await twitchObs.process("channel", "", "!cam zoom 200%", false);
    const sceneName = "Info Bar Top";
    const itemName = "Webcam";
    const props = obsClient.getSceneItemProperties(sceneName, itemName);

    expect(props).toEqual({
      crop: { bottom: 270, left: 480, right: 480, top: 270 },
      position: { x: 0, y: 855 },
      scale: { x: 0.4166666666666667, y: 0.4166666666666667 },
      sourceHeight: 1080,
      sourceWidth: 1920,
    });
  });
});
