import ObsClient from "./ObsClient";

export default class ObsCommands {
  obsClient: ObsClient;
  constructor(obsClient: ObsClient) {
    this.obsClient = obsClient;
  }
  process(_channel: string, _tags: string, msg: string, _self: boolean) {
    if (msg === "!cam top-left") {
      this.obsClient.setSceneItemProperties("Info Bar Top", "Webcam", {
        position: {
          x: 0,
          y: 80,
        },
      });
    }
    if (msg === "!cam top-right") {
      this.obsClient.setSceneItemProperties("Info Bar Top", "Webcam", {
        position: {
          x: 1920 - 400,
          y: 80,
        },
      });
    }
    if (msg === "!cam bottom-left") {
      this.obsClient.setSceneItemProperties("Info Bar Top", "Webcam", {
        position: {
          x: 0,
          y: 1080 - 225,
        },
      });
    }
    if (msg === "!cam bottom-right") {
      this.obsClient.setSceneItemProperties("Info Bar Top", "Webcam", {
        position: {
          x: 1920 - 400,
          y: 1080 - 225,
        },
      });
    }
  }
}
