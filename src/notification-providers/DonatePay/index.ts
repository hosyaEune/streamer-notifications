import type { Notification, NotificationSettings } from "../../types";
import { CentrifugeProvider } from "../CentrifugeProvider";
import type { DonatePayNotification, SettingsNotification } from "./types";

export class DonatePayProvider extends CentrifugeProvider {
  private static CENTRIFUGE_URL =
    "wss://centrifugo.donatepay.ru:43002/connection/websocket";
  private static SUBSCRIBE_ENDPOINT =
    "https://donatepay.ru/api/v2/socket/token";
  private accessToken: string;
  private settings: NotificationSettings[] = [];

  constructor(
    channel: string,
    accessToken: string,
    widgetTokens: string[],
    onMessage: (notification: Notification) => void
  ) {
    super(
      channel,
      onMessage,
      DonatePayProvider.CENTRIFUGE_URL,
      DonatePayProvider.SUBSCRIBE_ENDPOINT,
      accessToken
    );

    this.accessToken = accessToken;

    this._getNotificationSettings(widgetTokens).then(
      (settings) => (this.settings = settings)
    );
  }

  private _createVoicePath(widgetToken: string) {
    const url = `/api/donatepay/voice?widgetToken=${widgetToken}`;

    return (message: string, widgetId: string) =>
      `${url}&text=${message}&rate=medium&widget_id=${widgetId}`;
  }

  private _createSoundPath(path: string): string {
    return `/api/sounds?path=${path}`;
  }

  private _createImagePath(path: string): string {
    return `https://widget.donatepay.ru/uploads/notification/images/${path}`;
  }

  protected transformMessage(msg: DonatePayNotification): Notification | null {
    try {
      const {
        sum: amount,
        name: username,
        comment: message,
      } = msg.data.notification.vars;

      const settings = this.settings
        .filter((setting) => setting.minSum <= amount)
        .sort((a, b) => b.minSum - a.minSum)[0];

      if (!settings) return null;

      const { imagePath, soundPath, duration, widgetId, createVoicePath } =
        settings;

      return {
        provider: "donatepay",
        username,
        amount,
        message,
        imagePath: this._createImagePath(imagePath),
        soundPath: this._createSoundPath(soundPath),
        voicePath: createVoicePath(message, widgetId),
        duration,
      };
    } catch (error) {
      console.error("Failed to transform message:", error);
      return null;
    }
  }

  protected async getSocketToken(): Promise<string> {
    const res = await fetch("/api/donatepay/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_token: this.accessToken,
      }),
    });

    const data = await res.json();
    return data.token;
  }

  private async _getNotificationSettings(
    widgetTokens: string[]
  ): Promise<NotificationSettings[]> {
    const getSettings = async (widgetToken: string) => {
      return fetch(`/api/donatepay/settings?widgetToken=${widgetToken}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json() as Promise<SettingsNotification>);
    };

    const getSettingFetchers = widgetTokens.map(getSettings);

    const responses = await Promise.allSettled(getSettingFetchers);

    const result = responses
      .map((response, index) => {
        if (response.status === "fulfilled") {
          return Object.entries(response.value.notifications).map(
            ([key, notification]): NotificationSettings => ({
              duration: Number(notification["a_m.duration"]),
              imagePath: notification["a_s.image"],
              soundPath: notification["a_s.sound"],
              minSum: Number(notification["a_m.min_sum"]),
              widgetId: key.replace("#", ""),
              createVoicePath: this._createVoicePath(widgetTokens[index]),
            })
          );
        }

        return [];
      })
      .flat(Infinity);

    return result as NotificationSettings[];
  }
}
