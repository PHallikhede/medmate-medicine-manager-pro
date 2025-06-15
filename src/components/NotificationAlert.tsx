
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Bell, Settings, AlertCircle } from "lucide-react";

interface NotificationAlertProps {
  onTestNotification: () => void;
}

const NotificationAlert = ({ onTestNotification }: NotificationAlertProps) => {
  const getBrowserInstructions = () => {
    const userAgent = navigator.userAgent;
    
    if (userAgent.includes('Chrome')) {
      return "Look for the 🔔 icon in your address bar and click 'Allow'";
    } else if (userAgent.includes('Firefox')) {
      return "Look for the shield icon in your address bar and select 'Allow notifications'";
    } else if (userAgent.includes('Safari')) {
      return "Go to Safari → Preferences → Websites → Notifications and allow this site";
    } else if (userAgent.includes('Edge')) {
      return "Look for the 🔔 icon in your address bar and click 'Allow'";
    }
    
    return "Look for a notification icon in your address bar and click 'Allow'";
  };

  const handleBrowserSettings = () => {
    const userAgent = navigator.userAgent;
    let instructions = "";
    
    if (userAgent.includes('Chrome')) {
      instructions = "Chrome: Click the site information icon (🔒 or 🔔) next to the URL, then select 'Notifications' and choose 'Allow'. Or go to Settings > Privacy and security > Site settings > Notifications";
    } else if (userAgent.includes('Firefox')) {
      instructions = "Firefox: Click the shield icon in the address bar, or go to Settings > Privacy & Security > Permissions > Notifications and find this site";
    } else if (userAgent.includes('Safari')) {
      instructions = "Safari: Go to Safari menu > Preferences > Websites > Notifications, find this site and set to 'Allow'";
    } else if (userAgent.includes('Edge')) {
      instructions = "Edge: Click the site information icon next to the URL, then select 'Notifications' and choose 'Allow'";
    } else {
      instructions = "Look for a notification or site settings icon in your browser's address bar and enable notifications for this site";
    }
    
    alert(`Browser Settings Help:\n\n${instructions}`);
  };

  return (
    <Alert className="border-2 border-orange-300 bg-gradient-to-r from-orange-50 to-yellow-50 mb-6">
      <AlertCircle className="h-5 w-5 text-orange-600" />
      <AlertTitle className="text-orange-800 font-bold text-lg flex items-center gap-2">
        <Bell className="w-5 h-5" />
        Enable Notifications for Medicine Reminders
      </AlertTitle>
      <AlertDescription className="text-orange-700 space-y-3 mt-3">
        <p className="font-medium">
          To receive medicine reminders, you need to allow notifications:
        </p>
        
        <div className="bg-white/70 p-4 rounded-lg border border-orange-200">
          <p className="font-semibold text-orange-800 mb-2">📋 Step-by-step:</p>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Click the "Request Permission" button below</li>
            <li>{getBrowserInstructions()}</li>
            <li>Select "Allow" when prompted</li>
            <li>Test your notifications with the "Test Alert" button</li>
          </ol>
        </div>
        
        <div className="flex flex-wrap gap-3 mt-4">
          <Button 
            onClick={onTestNotification}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold"
          >
            <Bell className="w-4 h-4 mr-2" />
            Request Permission
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleBrowserSettings}
            className="border-orange-300 text-orange-700 hover:bg-orange-100"
          >
            <Settings className="w-4 h-4 mr-2" />
            Help & Settings
          </Button>
        </div>
        
        <p className="text-xs text-orange-600 italic">
          💡 If you don't see a popup, notifications might already be blocked. Use the Help & Settings button above.
        </p>
      </AlertDescription>
    </Alert>
  );
};

export default NotificationAlert;
