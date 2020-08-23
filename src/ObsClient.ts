import ObsWebSocket from "obs-websocket-js";

export default class ObsClient {
  obsWebSocket: ObsWebSocket | null;
  static createNull() {
    return new NullObsClient();
  }
  constructor(obsWebSocket: ObsWebSocket | null) {
    this.obsWebSocket = obsWebSocket;
  }
  async setSceneItemProperties(
    sceneName: string,
    itemName: string,
    properties: ObsWebSocket.SceneItemTransform
  ) {
    await this.obsWebSocket?.send("SetSceneItemProperties", {
      "scene-name": sceneName,
      item: itemName,
      ...properties,
    });
  }
  async getSceneItemProperties(sceneName: string, itemName: string) {
    return await this.obsWebSocket?.send("GetSceneItemProperties", {
      "scene-name": sceneName,
      item: itemName,
    });
  }
}

class NullObsClient extends ObsClient {
  lastSetSceneItemProperties: any;
  constructor() {
    super(null);
    this.lastSetSceneItemProperties = {
      sourceHeight: 1080,
      sourceWidth: 1920,
    };
  }
  async setSceneItemProperties(
    _sceneName: string,
    _itemName: string,
    properties: ObsWebSocket.SceneItemTransform
  ) {
    this.lastSetSceneItemProperties = properties;
  }
  getSceneItemProperties(_sceneName: string, _itemName: string) {
    return this.lastSetSceneItemProperties;
  }
}
