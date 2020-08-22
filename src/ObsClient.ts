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
    properties: { position: { x: number; y: number } }
  ) {
    const data = await this.getSceneItemProperties(sceneName, itemName);

    if (!data) {
      return;
    }

    await this.obsWebSocket?.send("SetSceneItemProperties", {
      "scene-name": sceneName,
      item: itemName,
      bounds: data.bounds,
      scale: data.scale,
      crop: data.crop,
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
  }
  async setSceneItemProperties(
    _sceneName: string,
    _itemName: string,
    properties: { position: { x: number; y: number } }
  ) {
    this.lastSetSceneItemProperties = properties;
  }
  getSceneItemProperties(_sceneName: string, _itemName: string) {
    return this.lastSetSceneItemProperties;
  }
}
