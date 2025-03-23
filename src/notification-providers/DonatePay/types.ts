export type DonatePayNotification = {
  data: Data;
};

type Data = {
  notification: Notification;
};

type Notification = {
  id: number;
  user_id: number;
  type: string;
  view: any;
  vars: Vars;
  created_at: string;
};

type Vars = {
  name: string;
  comment: string;
  sum: number;
  currency: string;
  target: string;
  video: Video;
  boss: string;
  premiumSettings: PremiumSettings;
  like: string;
  social_provider: string;
  social_name: string;
};

type Video = {
  link: any;
  id: any;
  start: any;
  finish: any;
  title: any;
  channel: Channel;
  image: any;
  live: any;
  duration: any;
  views: any;
  likes: any;
  dislikes: any;
  embeddable: any;
};

type Channel = {
  id: any;
  title: any;
};

type PremiumSettings = {
  image: any;
  effect: any;
  voice: any;
  emotion: any;
  speed: any;
};

export interface DonatePaySettings {
  notifications: SettingsNotification;
}

export interface SettingsNotification {
  [key: string]: {
    "a_m.duration": string;
    "a_s.image": string;
    "a_m.position": string;
    "a_m.min_sum": string;
    "a_m.preset_position": string;
    "alert.main": any;
    "a_m.font-family": string;
    "a_m.title-template": string;
    "a_m.background-color": string;
    "a_m.duration_type": string;
    "a_m.target": any;
    "a_m.stand_alone": string;
    "a_m.fixed-sum": string;
    "a_m.show-float": string;
    "a_m.names": any;
    "a_m.active": string;
    "alert.text-style": any;
    "a_t-s.title": any;
    "a_t-s_title.font-size": string;
    "a_t-s_title.font-weight": string;
    "a_t-s_title.font-style": string;
    "a_t-s_title.shadow-color": string;
    "a_t-s_title.shadow-width": string;
    "a_t-s_title.animation": string;
    "a_t-s_title.color": string;
    "alert.text-title.gradient-enabled": string;
    "alert.text-title.gradient-color_1": string;
    "alert.text-title.gradient-color_2": string;
    "alert.text-title.gradient.deg": string;
    "a_t-s.message": any;
    "a_t-s_message.font-size": string;
    "a_t-s_message.font-style": string;
    "a_t-s_message.shadow-color": string;
    "a_t-s_message.shadow-width": string;
    "a_t-s_message.animation": string;
    "a_t-s_message.font-weight": string;
    "a_t-s_message.background-color": string;
    "a_t-s_message.color": string;
    "a_t-s_message.font-family": string;
    "alert.text-message.gradient-enabled": string;
    "alert.text-message.gradient-color_1": string;
    "alert.text-message.gradient-color_2": string;
    "alert.text-message.gradient.deg": string;
    "alert.sound": any;
    "a_s.volume": string;
    "a_s.speeker": string;
    "a_s.speed": string;
    "a_s.play": string;
    "a_s.read-title": string;
    "a_s.sound-file": any;
    "a_s.sound": string;
    "a_s.voice-volume": string;
    "alert.image": any;
    "a_s.image-file": any;
    "a_i.payment": string;
    alert_animations: any;
    "a_a.show-animation": string;
    "a_a.hide-animation": string;
  };
}
