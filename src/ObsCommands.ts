import ObsClient from "./ObsClient";

export default class ObsCommands {
  obsClient: ObsClient;
  timeout: undefined | ReturnType<typeof setTimeout>;
  constructor(obsClient: ObsClient) {
    this.obsClient = obsClient;
    this.timeout = undefined;
  }
  async process(_channel: string, _tags: string, msg: string, _self: boolean) {
    if (msg === "!cam top-left") {
      await this.applyCamPosition({
        x: 0,
        y: 80,
      });
    }
    if (msg === "!cam top-right") {
      await this.applyCamPosition({
        x: 1920 - 400,
        y: 80,
      });
    }
    if (msg === "!cam bottom-left") {
      await this.camBottomLeft();
    }
    if (msg === "!cam bottom-right") {
      await this.applyCamPosition({
        x: 1920 - 400,
        y: 1080 - 225,
      });
    }
  }
  async applyCamPosition(position: { x: number; y: number }) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    await this.obsClient.setSceneItemProperties("Info Bar Top", "Webcam", {
      position,
    });
    this.timeout = setTimeout(() => {
      this.camBottomLeft();
    }, 20000);
  }
  async camBottomLeft() {
    await this.obsClient.setSceneItemProperties("Info Bar Top", "Webcam", {
      position: {
        x: 0,
        y: 1080 - 225,
      },
    });
  }
}
