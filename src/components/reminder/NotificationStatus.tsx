
import { Smartphone, Button } from "lucide-react";

interface NotificationStatusProps {
  notificationPermission: boolean;
  onTestNotification: () => void;
}

const NotificationStatus = ({ notificationPermission, onTestNotification }: NotificationStatusProps) => {
  return (
    <div className={`p-4 rounded-xl border-2 ${notificationPermission ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
      <div className="flex items-center gap-3">
        <Smartphone className={`w-5 h-5 ${notificationPermission ? 'text-green-600' : 'text-orange-600'}`} />
        <div className="flex-1">
          <p className={`font-semibold ${notificationPermission ? 'text-green-800' : 'text-orange-800'}`}>
            {notificationPermission ? '✅ Notifications Enabled' : '⚠️ Notifications Disabled'}
          </p>
          <p className={`text-sm ${notificationPermission ? 'text-green-600' : 'text-orange-600'}`}>
            {notificationPermission 
              ? 'You will receive push notifications for your medicine reminders'
              : 'Enable notifications to receive medicine alerts on your device'
            }
          </p>
        </div>
        <Button
          onClick={onTestNotification}
          size="sm"
          variant={notificationPermission ? "default" : "outline"}
          className="shrink-0"
        >
          Test Alert
        </Button>
      </div>
    </div>
  );
};

export default NotificationStatus;
