import ObsClient from "../ObsClient";
import ObsCommands from "../ObsCommands";

describe("twitch obs commands", () => {
  it("moves the cam to top-left", () => {
    const obsClient = ObsClient.createNull();
    const twitchObs = new ObsCommands(obsClient);
    twitchObs.process("channel", "", "!cam top-left", false);
    const sceneName = "Info Bar Top";
    const itemName = "Webcam";
    const props = obsClient.getSceneItemProperties(sceneName, itemName);

    expect(props.position.x).toBe(0);
    expect(props.position.y).toBe(80);
  });
  it("moves the cam to top-right", () => {
    const obsClient = ObsClient.createNull();
    const twitchObs = new ObsCommands(obsClient);
    twitchObs.process("channel", "", "!cam top-right", false);
    const sceneName = "Info Bar Top";
    const itemName = "Webcam";
    const props = obsClient.getSceneItemProperties(sceneName, itemName);

    expect(props.position.x).toBe(1920 - 400);
    expect(props.position.y).toBe(80);
  });
  it("moves the cam to bottom-left", () => {
    const obsClient = ObsClient.createNull();
    const twitchObs = new ObsCommands(obsClient);
    twitchObs.process("channel", "", "!cam bottom-left", false);
    const sceneName = "Info Bar Top";
    const itemName = "Webcam";
    const props = obsClient.getSceneItemProperties(sceneName, itemName);

    expect(props.position.x).toBe(0);
    expect(props.position.y).toBe(1080 - 225);
  });
  it("moves the cam to bottom-right", () => {
    const obsClient = ObsClient.createNull();
    const twitchObs = new ObsCommands(obsClient);
    twitchObs.process("channel", "", "!cam bottom-right", false);
    const sceneName = "Info Bar Top";
    const itemName = "Webcam";
    const props = obsClient.getSceneItemProperties(sceneName, itemName);

    expect(props.position.x).toBe(1920 - 400);
    expect(props.position.y).toBe(1080 - 225);
  });
});
