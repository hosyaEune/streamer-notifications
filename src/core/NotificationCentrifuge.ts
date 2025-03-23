import Centrifuge from "centrifuge";
import { Donation } from "./Donation";

export abstract class DonationCentrifuge<
  SocketMessageType
> extends Donation<SocketMessageType> {
  async connect() {
    this.notifications = (await this._getNotificationSettings()).map(
      (notification) => ({
        ...notification,
        imagePath: this.createImagePath(notification.imagePath),
        soundPath: this.createSoundPath(notification.soundPath),
      })
    );

    if (this.notifications.length === 0) return;

    const centrifugeDPay = new Centrifuge(
      "wss://centrifugo.donatepay.ru:43002/connection/websocket",
      {
        subscribeEndpoint: "https://donatepay.ru/api/v2/socket/token",
        subscribeParams: {
          access_token: await this._getAccessToken(),
        },
        disableWithCredentials: true,
      }
    );

    // Предоставляем токен подключения
    centrifugeDPay.setToken(await this._getSoketToken());

    centrifugeDPay.subscribe(this.channel, (msg: any) =>
      this.onMessage(msg, this.notifications)
    );

    // TODO: remove
    centrifugeDPay.on("error", (e) => {
      console.log("error", e);
    });

    centrifugeDPay.on("subscribe", (e) => {
      console.log("subscribe", e);
    });

    centrifugeDPay.on("connect", (e) => {
      console.log(e);
    });
    // /TODO

    // Метод фактического подключения к серверу
    centrifugeDPay.connect();
  }

  abstract _getAccessToken(): Promise<string>;

  abstract _getSoketToken(): Promise<string>;
}
