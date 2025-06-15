
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export class NotificationService {
  static async requestPermissions() {
    if (!Capacitor.isNativePlatform()) {
      console.log('Not a native platform, using browser notifications');
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      }
      return false;
    }

    const result = await LocalNotifications.requestPermissions();
    return result.display === 'granted';
  }

  static async scheduleReminder(id: number, title: string, body: string, scheduledTime: Date, medicines: string[]) {
    if (!Capacitor.isNativePlatform()) {
      // Fallback for web - schedule browser notification
      this.scheduleBrowserNotification(title, body, scheduledTime);
      return;
    }

    await LocalNotifications.schedule({
      notifications: [
        {
          title,
          body,
          id,
          schedule: {
            at: scheduledTime,
            repeats: true,
            every: 'day'
          },
          sound: 'default',
          attachments: undefined,
          actionTypeId: "",
          extra: {
            medicines: medicines
          }
        }
      ]
    });
  }

  static async cancelReminder(id: number) {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    await LocalNotifications.cancel({
      notifications: [{ id }]
    });
  }

  static async getAllScheduledNotifications() {
    if (!Capacitor.isNativePlatform()) {
      return [];
    }

    const result = await LocalNotifications.getPending();
    return result.notifications;
  }

  private static scheduleBrowserNotification(title: string, body: string, scheduledTime: Date) {
    const now = new Date();
    const timeUntilNotification = scheduledTime.getTime() - now.getTime();

    if (timeUntilNotification > 0) {
      setTimeout(() => {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(title, {
            body,
            icon: '/favicon.ico',
            badge: '/favicon.ico'
          });
        }
      }, timeUntilNotification);
    }
  }

  static async showInstantNotification(title: string, body: string) {
    if (!Capacitor.isNativePlatform()) {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
          body,
          icon: '/favicon.ico'
        });
      }
      return;
    }

    await LocalNotifications.schedule({
      notifications: [
        {
          title,
          body,
          id: Date.now(),
          schedule: {
            at: new Date(Date.now() + 1000) // 1 second from now
          }
        }
      ]
    });
  }
}
