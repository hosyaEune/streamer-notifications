import Centrifuge from "centrifuge";
import { NotificationProvider } from "./NotificationProvider";
import type { Notification } from "../types";

// Абстрактный класс для провайдеров, работающих через Centrifuge
export abstract class CentrifugeProvider extends NotificationProvider {
  protected centrifuge: Centrifuge;

  constructor(
    channel: string,
    onMessage: (notification: Notification) => void,
    centrifugeUrl: string,
    subscribeEndpoint: string,
    accessToken: string
  ) {
    super(channel, onMessage);

    this.centrifuge = new Centrifuge(centrifugeUrl, {
      subscribeEndpoint,
      subscribeParams: {
        access_token: accessToken,
      },
      disableWithCredentials: true,
    });
  }

  async connect(): Promise<void> {
    const token = await this.getSocketToken();
    this.centrifuge.setToken(token);

    this.centrifuge.subscribe(this.channel, (msg) => {
      const notification = this.transformMessage(msg);
      if (notification) {
        this.onMessage(notification);
      }
    });

    this.centrifuge.connect();
  }

  disconnect(): void {
    this.centrifuge.disconnect();
  }

  protected abstract getSocketToken(): Promise<string>;
  protected abstract transformMessage(msg: any): Notification | null;
}
