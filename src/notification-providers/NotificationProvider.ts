import type { Notification } from "../types";

// Базовый абстрактный класс для всех провайдеров уведомлений
export abstract class NotificationProvider {
  constructor(
    protected channel: string,
    protected onMessage: (notification: Notification) => void
  ) {}

  abstract connect(): Promise<void>;
  abstract disconnect(): void;
}
