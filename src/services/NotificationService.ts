
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export class NotificationService {
  static async requestPermissions() {
    console.log('Requesting notification permissions...');
    
    if (!Capacitor.isNativePlatform()) {
      console.log('Not a native platform, using browser notifications');
      if ('Notification' in window) {
        console.log('Current permission status:', Notification.permission);
        
        // Check current permission status
        if (Notification.permission === 'default') {
          console.log('Permission is default, requesting permission...');
          // This will trigger the popup
          const permission = await Notification.requestPermission();
          console.log('Permission result:', permission);
          return permission === 'granted';
        }
        
        const isGranted = Notification.permission === 'granted';
        console.log('Permission already set:', isGranted);
        return isGranted;
      }
      console.log('Notifications not supported in this browser');
      return false;
    }

    const result = await LocalNotifications.requestPermissions();
    return result.display === 'granted';
  }

  static async scheduleReminder(id: number, title: string, body: string, scheduledTime: Date, medicines: string[]) {
    console.log('Scheduling reminder:', { id, title, body, scheduledTime });
    
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
    
    console.log('Scheduling browser notification for:', scheduledTime, 'Time until:', timeUntilNotification);

    if (timeUntilNotification > 0) {
      setTimeout(() => {
        console.log('Triggering scheduled notification...');
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(title, {
            body,
            icon: '/favicon.ico',
            badge: '/favicon.ico'
          });
        } else {
          console.log('Cannot show notification, permission:', Notification.permission);
        }
      }, timeUntilNotification);
    } else {
      console.log('Scheduled time is in the past, not scheduling');
    }
  }

  static async showInstantNotification(title: string, body: string) {
    console.log('Showing instant notification:', { title, body });
    
    if (!Capacitor.isNativePlatform()) {
      if ('Notification' in window) {
        console.log('Current permission for instant notification:', Notification.permission);
        
        if (Notification.permission === 'granted') {
          console.log('Creating browser notification...');
          const notification = new Notification(title, {
            body,
            icon: '/favicon.ico',
            tag: 'medmate-instant'
          });
          
          notification.onclick = () => {
            console.log('Notification clicked');
            window.focus();
            notification.close();
          };
          
          // Auto close after 5 seconds
          setTimeout(() => {
            notification.close();
          }, 5000);
          
          return true;
        } else {
          console.log('Notification permission not granted:', Notification.permission);
          return false;
        }
      } else {
        console.log('Notifications not supported in this browser');
        return false;
      }
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
    
    return true;
  }

  // New method to check current permission status
  static getPermissionStatus() {
    if (!Capacitor.isNativePlatform()) {
      if ('Notification' in window) {
        console.log('Getting permission status:', Notification.permission);
        return Notification.permission;
      }
      return 'default';
    }
    return 'default';
  }
}
