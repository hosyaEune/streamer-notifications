// import EventBus from "./EventBus";

import { isValidURL } from "../utils";

export type Notification = {
  imagePath: string;
  soundPath: string;
  username: string;
  amount: number;
  message: string;
  duration: number;
};

export type NotificationSettings = {
  imagePath: string;
  soundPath: string;
  duration: number;
  minSum: number;
};

export abstract class Donation<SocketMessageType> {
  notifications: NotificationSettings[] = [];

  constructor(
    public channel: string,
    public onMessage: (
      msg: SocketMessageType,
      notifications: NotificationSettings[]
    ) => void
  ) {}

  createImagePath(path: string) {
    if (isValidURL(path)) {
      return path;
    }

    return this._createImagePath(path);
  }

  createSoundPath(path: string) {
    if (isValidURL(path)) {
      return path;
    }

    return this._createSoundPath(path);
  }

  abstract connect(): Promise<void>;

  abstract _createImagePath(path: string): string;
  abstract _createSoundPath(path: string): string;
  abstract _getNotificationSettings(): Promise<NotificationSettings[]>;
}
