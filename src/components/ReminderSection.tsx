
import NotificationAlert from "./NotificationAlert";
import NotificationStatus from "./reminder/NotificationStatus";
import ReminderForm from "./reminder/ReminderForm";
import ActiveRemindersList from "./reminder/ActiveRemindersList";
import { useNotificationPermission } from "@/hooks/useNotificationPermission";
import { useReminders } from "@/hooks/useReminders";

const ReminderSection = () => {
  const { notificationPermission, testNotification } = useNotificationPermission();
  const { activeReminders, setReminder, removeReminder } = useReminders();

  return (
    <div className="space-y-6">
      {/* Show alert only when notifications are disabled */}
      {!notificationPermission && (
        <NotificationAlert onTestNotification={testNotification} />
      )}

      <NotificationStatus 
        notificationPermission={notificationPermission}
        onTestNotification={testNotification}
      />

      <ReminderForm onSetReminder={setReminder} />

      <ActiveRemindersList 
        activeReminders={activeReminders}
        onRemoveReminder={removeReminder}
      />
    </div>
  );
};

export default ReminderSection;
