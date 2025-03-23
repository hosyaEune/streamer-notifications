type CommonAlert = {
  username: string;
  imagePath: string;
  soundPath: string;
  duration: number;
};

type DonationAlert = {
  type: "donation";
  amount: number;
  message: string;
  voicePath: string;
} & CommonAlert;

type SubscriptionAlert = {
  type: "subscription";
  // message: string;
} & CommonAlert;

type FollowAlert = {
  type: "follow";
} & CommonAlert;

export type Alert = DonationAlert | SubscriptionAlert | FollowAlert;

export interface Notification {
  provider: string;
  imagePath: string;
  soundPath: string;
  username: string;
  amount: number;
  message: string;
  voicePath: string;
  duration: number;
}

export interface NotificationSettings {
  imagePath: string;
  soundPath: string;
  duration: number;
  minSum: number;
  widgetId: string;
  createVoicePath: (message: string, widgetId: string) => string;
}

export enum NotificationEvents {
  NEW_NOTIFICATION = "NEW_NOTIFICATION",
  SETTINGS_UPDATED = "SETTINGS_UPDATED",
  ERROR = "ERROR",
}
