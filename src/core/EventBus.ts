type Listeners = {
  [key: string]: Array<() => void>;
};

export interface IEventBus {
  _listeners: Listeners;
  on(event: string, callback: (...args: any) => void): void;
  off(event: string, callback: (...args: any) => void): void;
  emit(event: string, ...args: any): void;
}

class EventBus implements IEventBus {
  _listeners: Listeners = {};

  on(event: string, callback: (...args: any) => void): void {
    if (!this._listeners[event]) {
      this._listeners[event] = [];
    }

    this._listeners[event].push(callback);
  }

  off(event: string, callback: (...args: any) => void): void {
    if (!this._listeners[event]) {
      return;
    }

    this._listeners[event] = this._listeners[event].filter(
      (listener) => listener !== callback
    );
  }

  emit(event: string, ...args: any): void {
    if (!this._listeners[event] || this._listeners[event].length === 0) {
      return;
    }

    this._listeners[event].forEach((listener) => {
      listener.apply(listener, args);
    });
  }
}

export default EventBus;
