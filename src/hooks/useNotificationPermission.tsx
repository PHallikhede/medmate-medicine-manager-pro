
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { NotificationService } from "@/services/NotificationService";

export const useNotificationPermission = () => {
  const [notificationPermission, setNotificationPermission] = useState(false);
  const welcomeNotificationSent = useRef(false);
  const { toast } = useToast();

  useEffect(() => {
    checkNotificationPermission();
    
    // Check permission status every 2 seconds to catch when user enables it
    const interval = setInterval(checkNotificationPermission, 2000);
    return () => clearInterval(interval);
  }, []);

  const checkNotificationPermission = async () => {
    try {
      const currentStatus = NotificationService.getPermissionStatus();
      const isGranted = currentStatus === 'granted';
      
      console.log('Checking notification permission:', currentStatus, 'Granted:', isGranted);
      
      // Only update state if it changed
      if (isGranted !== notificationPermission) {
        setNotificationPermission(isGranted);
        
        // If notifications are now enabled and we haven't sent the welcome notification yet
        if (isGranted && !notificationPermission && !welcomeNotificationSent.current) {
          console.log('Notifications just became enabled, sending welcome notification');
          welcomeNotificationSent.current = true;
          
          const success = await NotificationService.showInstantNotification(
            "🎉 Notifications Enabled - MedMate",
            "Perfect! You'll now receive medicine reminders on your device."
          );
          
          if (success) {
            toast({
              title: "Notifications Enabled! 🎉",
              description: "You should see a test notification now. Medicine reminders are ready to go!",
            });
          } else {
            console.log('Failed to send welcome notification');
          }
        }
      }
      
      if (currentStatus === 'denied') {
        toast({
          title: "Notifications Blocked",
          description: "Please enable notifications in your browser settings to receive medicine reminders",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error checking notification permission:', error);
    }
  };

  const testNotification = async () => {
    console.log('Test notification button clicked');
    
    try {
      const hasPermission = await NotificationService.requestPermissions();
      console.log('Permission request result:', hasPermission);
      
      if (!hasPermission) {
        toast({
          title: "Permission Required",
          description: "Please allow notifications to test alerts. Look for the popup in your browser!",
          variant: "destructive"
        });
        return;
      }
      
      setNotificationPermission(true);

      const success = await NotificationService.showInstantNotification(
        "💊 Test Notification - MedMate",
        "This is how your medicine reminders will look!"
      );

      if (success) {
        toast({
          title: "Test Notification Sent! 📱",
          description: "Check your device/browser for the notification",
        });
      } else {
        toast({
          title: "Notification Failed",
          description: "Could not send test notification. Please check your browser settings.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
      toast({
        title: "Error",
        description: "Failed to send test notification. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    notificationPermission,
    testNotification
  };
};
