import ObsWebSocket from "obs-websocket-js";
import ObsClient from "./ObsClient";
import ICommandData from "./interfaces/ICommandData";

const camWidth = 400;
const camHeight = 225;
// todo: can we get the canvas dimensions from OBS?
const canvasWidth = 1920;
const canvasHeight = 1080;

const sceneName = "[S] Main scene";
const camName = "[C] Main camera";
const CAM_HOME_POSITION = "bottom-right";
const SECONDARY_CAM_NAME = "[C] Secondary camera";

type PositionName = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface Position {
  x: number;
  y: number;
}
interface PositionsMap {
  "top-left": Position;
  "top-right": Position;
  "bottom-left": Position;
  "bottom-right": Position;
}

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
    if (msg === "!cam2 on") {
      await this.camShowHide(true, 1);
    }
    if (msg === "!cam2 off") {
      await this.camShowHide(false, 1);
    }

    if (
      msg === "!cam top-left" ||
      msg === "!cam top-right" ||
      msg === "!cam bottom-left" ||
      msg === "!cam bottom-right"
    ) {
      const desiredPosition = msg.split(" ")[1];

      if (
        desiredPosition === "top-left" ||
        desiredPosition === "top-right" ||
        desiredPosition === "bottom-left" ||
        desiredPosition === "bottom-right"
      ) {
        await this.applyCamPosition(desiredPosition);
        if (msg !== `!cam ${CAM_HOME_POSITION}`) {
          await this.resetToHomePositionAfterDelay();
        }
      }
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
  async camDisplay(onOff: boolean, camIndex = 0) {
    if (this.visibleTimeout) {
      clearTimeout(this.visibleTimeout);
    }

    await this.camShowHide(onOff, camIndex);

    if (onOff === false) {
      this.visibleTimeout = setTimeout(async () => {
        await this.camShowHide(true, camIndex);
      }, 20000);
    }
  }
  async camShowHide(onOff: boolean, camIndex = 0) {
    const targetCamName = camIndex === 0 ? camName : SECONDARY_CAM_NAME;

    const currentProperties = await this.obsClient.getSceneItemProperties(
      sceneName,
      targetCamName
    );

    if (!currentProperties) {
      return;
    }

    await this.obsClient.setSceneItemProperties(sceneName, targetCamName, {
      ...currentProperties,
      visible: onOff,
    });
  }
  async applyCamPosition(positionName: PositionName) {
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

    const positions: PositionsMap = {
      "top-left": { x: 0, y: 0 },
      "top-right": { x: canvasWidth - camWidth, y: 0 },
      "bottom-left": { x: 0, y: canvasHeight - camHeight },
      "bottom-right": {
        x: canvasWidth - camWidth,
        y: canvasHeight - camHeight,
      },
    };

    const position = positions[positionName];

    await this.obsClient.setSceneItemProperties(sceneName, camName, {
      ...currentProperties,
      position: {
        ...currentProperties.position,
        ...position,
      },
    });
  }
  async resetToHomePositionAfterDelay() {
    this.positionTimeout = setTimeout(async () => {
      await this.applyCamPosition(CAM_HOME_POSITION);
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
