import type { Notification } from "../types";
import type { NotificationProvider } from "./NotificationProvider";

export class NotificationFacade {
  private static instance: NotificationFacade;
  private providers: Map<string, NotificationProvider> = new Map();
  private listeners: Set<(notification: Notification) => void> = new Set();

  private constructor() {}

  static getInstance(): NotificationFacade {
    if (!NotificationFacade.instance) {
      NotificationFacade.instance = new NotificationFacade();
    }

    return NotificationFacade.instance;
  }

  addProvider(name: string, provider: NotificationProvider): void {
    this.providers.set(name, provider);
  }

  removeProvider(name: string): void {
    const provider = this.providers.get(name);
    if (provider) {
      provider.disconnect();
      this.providers.delete(name);
    }
  }

  subscribe(callback: (notification: Notification) => void): void {
    this.listeners.add(callback);
  }

  unsubscribe(callback: (notification: Notification) => void): void {
    this.listeners.delete(callback);
  }

  private handleNotification(notification: Notification): void {
    this.listeners.forEach((listener) => listener(notification));
  }

  async connectAll(): Promise<void> {
    for (const provider of this.providers.values()) {
      await provider.connect();
    }
  }

  disconnectAll(): void {
    this.providers.forEach((provider) => provider.disconnect());
    this.providers.clear();
    this.listeners.clear();
  }
}
