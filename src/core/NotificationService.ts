import { WSController } from "./WS";
import EventBus from "./EventBus";
import { NotificationEvents, type Notification } from "../types";

export class NotificationService extends EventBus {
  private static instance: NotificationService;
  private connections: Map<string, WSController> = new Map();

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }

    return NotificationService.instance;
  }

  public connect(
    provider: string,
    config: {
      url: string;
      channel: string;
      token?: string;
    }
  ): void {
    const ws = new WSController(config.url);

    ws.on(WSController.EVENTS.MESSAGE, (event: MessageEvent) => {
      const notification = this.parseNotification(provider, event.data);
      this.emit(NotificationEvents.NEW_NOTIFICATION, notification);
    });

    ws.on(WSController.EVENTS.ERROR, (error) => {
      this.emit(NotificationEvents.ERROR, { provider, error });
    });

    this.connections.set(provider, ws);
    ws.connect();
  }

  public disconnect(provider: string): void {
    const connection = this.connections.get(provider);
    if (connection) {
      connection.closeConnection();
      this.connections.delete(provider);
    }
  }

  public disconnectAll(): void {
    this.connections.forEach((connection) => connection.closeConnection());
    this.connections.clear();
  }

  private parseNotification(provider: string, data: any): Notification {
    // Реализация парсинга в зависимости от провайдера
    const parsed = JSON.parse(data);

    return {
      provider,
      ...parsed,
    };
  }
}
