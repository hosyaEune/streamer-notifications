import EventBus from "./EventBus";

export enum WSEvents {
  open = "open",
  message = "message",
  error = "error",
  close = "close",
}

const ABNORMAL_CLOSURE = 1006;

export class WSController extends EventBus {
  private _ws: WebSocket | undefined;
  private _pingTimer: NodeJS.Timeout | undefined;

  static EVENTS = {
    OPEN: "OPEN",
    CLOSE: "CLOSE",
    CONNECT: "CONNECT",
    RECONNECT: "RECONNECT",
    MESSAGE: "MESSAGE",
    ERROR: "ERROR",
  };

  constructor(private _url: string) {
    super();
    this._onOpen = this._onOpen.bind(this);
    this._onMessage = this._onMessage.bind(this);
    this._onError = this._onError.bind(this);
    this._onClose = this._onClose.bind(this);
  }

  private _addEvents() {
    if (this._ws) {
      this._ws.addEventListener(WSEvents.open, this._onOpen);
      this._ws.addEventListener(WSEvents.error, this._onError);
      this._ws.addEventListener(WSEvents.close, this._onClose);
      this._ws.addEventListener(WSEvents.message, this._onMessage);
    }
  }

  private _removeEvents() {
    if (this._ws) {
      this._ws.removeEventListener(WSEvents.open, this._onOpen);
      this._ws.removeEventListener(WSEvents.error, this._onError);
      this._ws.removeEventListener(WSEvents.close, this._onClose);
    }
  }

  private _onOpen() {
    this._pingTimer = setInterval(() => {
      if (this._ws) {
        this._ws.send("PING");
      }
    }, 15000);
    this.emit(WSController.EVENTS.OPEN);
  }

  private _onError(args: unknown) {
    this.emit(WSController.EVENTS.ERROR, args);
  }

  private _onClose(event: CloseEventInit) {
    this._removeEvents();
    this.emit(WSController.EVENTS.CLOSE, event);
    if (event.wasClean) {
      console.log("Connection closed", "error");
    } else {
      console.log("Network error", "error");
    }

    if (event.code === ABNORMAL_CLOSURE) {
      this._reconnect();
    }
  }

  private _reconnect() {
    if (this._url) {
      this.connect();
      this.emit(WSController.EVENTS.RECONNECT);
    }
  }

  private _onMessage(args: unknown) {
    this.emit(WSController.EVENTS.MESSAGE, args);
  }

  public connect() {
    this._ws = new WebSocket(this._url);
    this._addEvents();
    this.emit(WSController.EVENTS.CONNECT);
  }

  public closeConnection() {
    if (this._pingTimer) {
      clearInterval(this._pingTimer);
    }

    if (this._ws) {
      this._ws.close();
      this._removeEvents();
    }
  }

  public sendMessage(data: Object) {
    if (this._ws && data) {
      this._ws.send(JSON.stringify(data));
    }
  }
}
