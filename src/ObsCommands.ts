import ObsWebSocket from "obs-websocket-js";
import ObsClient from "./ObsClient";

const camWidth = 400;
const camHeight = 225;
const canvasWidth = 1920;
const canvasHeight = 1080;

export default class ObsCommands {
  obsClient: ObsClient;
  positionTimeout: undefined | ReturnType<typeof setTimeout>;
  zoomTimeout: undefined | ReturnType<typeof setTimeout>;
  constructor(obsClient: ObsClient) {
    this.obsClient = obsClient;
    this.positionTimeout = undefined;
    this.zoomTimeout = undefined;
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
        x: canvasWidth - camWidth,
        y: 80,
      });
    }
    if (msg === "!cam bottom-left") {
      await this.camBottomLeft();
    }
    if (msg === "!cam bottom-right") {
      await this.applyCamPosition({
        x: canvasWidth - camWidth,
        y: canvasHeight - camHeight,
      });
    }

    if (
      msg === "!cam zoom 100%" ||
      msg === "!cam zoom 150%" ||
      msg === "!cam zoom 200%"
    ) {
      const currentProperties = await this.obsClient.getSceneItemProperties(
        "Info Bar Top",
        "Webcam"
      );

      if (!currentProperties) {
        return;
      }

      const factor =
        msg === "!cam zoom 100%" ? 0 : msg === "!cam zoom 150%" ? 3 : 2;

      const crop = {
        bottom: factor > 0 ? currentProperties.sourceHeight / (factor * 2) : 0,
        top: factor > 0 ? currentProperties.sourceHeight / (factor * 2) : 0,
        left: factor > 0 ? currentProperties.sourceWidth / (factor * 2) : 0,
        right: factor > 0 ? currentProperties.sourceWidth / (factor * 2) : 0,
      };
      const properties = {
        ...currentProperties,
        crop,
        position: {
          ...currentProperties.position,
          x: 0,
          y: canvasHeight - camHeight,
        },
        scale: {
          x:
            camWidth /
            (currentProperties.sourceWidth - (crop.left + crop.right)),
          y:
            camHeight /
            (currentProperties.sourceHeight - (crop.top + crop.bottom)),
        },
      };

      this.applyCamZoom(properties);
    }
  }
  async applyCamPosition(position: { x: number; y: number }) {
    if (this.positionTimeout) {
      clearTimeout(this.positionTimeout);
    }
    const currentProperties = await this.obsClient.getSceneItemProperties(
      "Info Bar Top",
      "Webcam"
    );

    if (!currentProperties) {
      return;
    }

    await this.obsClient.setSceneItemProperties("Info Bar Top", "Webcam", {
      ...currentProperties,
      position: {
        ...currentProperties.position,
        ...position,
      },
    });
    this.positionTimeout = setTimeout(() => {
      this.camBottomLeft();
    }, 20000);
  }
  async applyCamZoom(properties: ObsWebSocket.SceneItemTransform) {
    if (this.zoomTimeout) {
      clearTimeout(this.zoomTimeout);
    }

    await this.obsClient.setSceneItemProperties(
      "Info Bar Top",
      "Webcam",
      properties
    );
    this.zoomTimeout = setTimeout(() => {
      this.camZoom100();
    }, 20000);
  }
  async camBottomLeft() {
    const currentProperties = await this.obsClient.getSceneItemProperties(
      "Info Bar Top",
      "Webcam"
    );

    if (!currentProperties) {
      return;
    }

    await this.obsClient.setSceneItemProperties("Info Bar Top", "Webcam", {
      ...currentProperties,
      position: {
        ...currentProperties.position,
        x: 0,
        y: 1080 - 225,
      },
    });
  }
  async camZoom100() {
    const currentProperties = await this.obsClient.getSceneItemProperties(
      "Info Bar Top",
      "Webcam"
    );

    if (!currentProperties) {
      return;
    }

    const factor = 0;

    const crop = {
      bottom: factor > 0 ? currentProperties.sourceHeight / (factor * 2) : 0,
      top: factor > 0 ? currentProperties.sourceHeight / (factor * 2) : 0,
      left: factor > 0 ? currentProperties.sourceWidth / (factor * 2) : 0,
      right: factor > 0 ? currentProperties.sourceWidth / (factor * 2) : 0,
    };
    const properties = {
      ...currentProperties,
      crop,
      position: {
        ...currentProperties.position,
        x: 0,
        y: canvasHeight - camHeight,
      },
      scale: {
        x:
          camWidth / (currentProperties.sourceWidth - (crop.left + crop.right)),
        y:
          camHeight /
          (currentProperties.sourceHeight - (crop.top + crop.bottom)),
      },
    };

    await this.obsClient.setSceneItemProperties(
      "Info Bar Top",
      "Webcam",
      properties
    );
  }
}
