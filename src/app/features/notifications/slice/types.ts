export interface NotificationState {
  notifications: Notification[];
}

export interface Notification {
  id: string;
  message: string;
  options?: any;
  dismissed: boolean;
}
