import ObsWebSocket from "obs-websocket-js";
import ObsClient from "./ObsClient";
import ICommandData from "./interfaces/ICommandData";

const camWidth = 400;
const camHeight = 225;
// todo: can we get the canvas dimensions from OBS?
const canvasWidth = 1920;
const canvasHeight = 1080;

const sceneName = "Info Bar Top";
const camName = "Webcam";

export default class ObsCommands {
  obsClient: ObsClient;
  visibleTimeout: undefined | ReturnType<typeof setTimeout>;
  positionTimeout: undefined | ReturnType<typeof setTimeout>;
  zoomTimeout: undefined | ReturnType<typeof setTimeout>;
  constructor(obsClient: ObsClient) {
    this.obsClient = obsClient;
    this.visibleTimeout = undefined;
    this.positionTimeout = undefined;
    this.zoomTimeout = undefined;
  }
  async process(commandData: ICommandData) {
    const msg = commandData.message.message;

    if (msg === "!cam on") {
      await this.camDisplay(true);
    }
    if (msg === "!cam off") {
      await this.camDisplay(false);
    }
    if (msg === "!cam top-left") {
      await this.applyCamPosition({
        x: 0,
        y: 0,
      });
    }
    if (msg === "!cam top-right") {
      await this.applyCamPosition({
        x: canvasWidth - camWidth,
        y: 0,
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
        sceneName,
        camName
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
  async camDisplay(onOff: boolean) {
    if (this.visibleTimeout) {
      clearTimeout(this.visibleTimeout);
    }

    const currentProperties = await this.obsClient.getSceneItemProperties(
      sceneName,
      camName
    );

    if (!currentProperties) {
      return;
    }

    await this.obsClient.setSceneItemProperties(sceneName, camName, {
      ...currentProperties,
      visible: onOff,
    });

    if (onOff === false) {
      this.visibleTimeout = setTimeout(() => {
        this.camDisplay(true);
      }, 20000);
    }
  }
  async applyCamPosition(position: { x: number; y: number }) {
    if (this.positionTimeout) {
      clearTimeout(this.positionTimeout);
    }
    const currentProperties = await this.obsClient.getSceneItemProperties(
      sceneName,
      camName
    );

    if (!currentProperties) {
      return;
    }

    await this.obsClient.setSceneItemProperties(sceneName, camName, {
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

    await this.obsClient.setSceneItemProperties(sceneName, camName, properties);
    this.zoomTimeout = setTimeout(() => {
      this.camZoom100();
    }, 20000);
  }
  async camBottomLeft() {
    const currentProperties = await this.obsClient.getSceneItemProperties(
      sceneName,
      camName
    );

    if (!currentProperties) {
      return;
    }

    await this.obsClient.setSceneItemProperties(sceneName, camName, {
      ...currentProperties,
      position: {
        ...currentProperties.position,
        x: 0,
        y: canvasHeight - camHeight,
      },
    });
  }
  async camZoom100() {
    const currentProperties = await this.obsClient.getSceneItemProperties(
      sceneName,
      camName
    );

    if (!currentProperties) {
      return;
    }

    const crop = {
      bottom: 0,
      top: 0,
      left: 0,
      right: 0,
    };
    const properties = {
      ...currentProperties,
      crop,
      scale: {
        x:
          camWidth / (currentProperties.sourceWidth - (crop.left + crop.right)),
        y:
          camHeight /
          (currentProperties.sourceHeight - (crop.top + crop.bottom)),
      },
    };

    await this.obsClient.setSceneItemProperties(sceneName, camName, properties);
  }
}
