import events from "events";

export default class EventEmitter {
  eventEmitter: events.EventEmitter;
  lastEmitted: [string | symbol, any];
  static create() {
    return new EventEmitter(new events.EventEmitter());
  }
  static createNull() {
    return new EventEmitter(new NullEventEmitter());
  }
  constructor(eventEmitter: events.EventEmitter) {
    this.eventEmitter = eventEmitter;
    this.lastEmitted = ["", null];
  }
  emit(event: string | symbol, ...args: any[]): boolean {
    this.lastEmitted = [event, args];
    return this.eventEmitter.emit(event, ...args);
  }
  on(event: string | symbol, listener: (...args: any[]) => void) {
    this.eventEmitter.on(event, listener);
  }
  getLastEmitted() {
    return this.lastEmitted;
  }
}

class NullEventEmitter extends events.EventEmitter {
  lastEmitted: [string | symbol, any];
  emit(event: string | symbol, ...args: any[]): boolean {
    this.lastEmitted = [event, args];
    return true;
  }
  on(_event: string | symbol, _listener: (...args: any[]) => void) {
    return this;
  }
}
