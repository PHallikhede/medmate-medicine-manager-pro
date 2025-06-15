
import { AlarmClock, Clock, Mail, Smartphone, Trash2, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActiveRemindersListProps {
  activeReminders: any[];
  onRemoveReminder: (reminder: any) => void;
}

const ActiveRemindersList = ({ activeReminders, onRemoveReminder }: ActiveRemindersListProps) => {
  if (activeReminders.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="relative inline-block">
          <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <Bell className="w-6 h-6 absolute -top-2 -right-2 text-green-300 animate-pulse" />
        </div>
        <p className="text-lg font-medium mb-2">No active reminders</p>
        <p className="text-sm text-gray-400">Set a time above to get medicine reminders via email and push notifications</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
        <AlarmClock className="w-5 h-5 text-green-600" />
        Active Reminders:
      </h3>
      {activeReminders.map((reminder, index) => (
        <div
          key={reminder.id}
          className="group flex items-center justify-between p-5 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 rounded-2xl border-2 border-green-200/60 hover:border-green-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-200">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-green-800 font-semibold text-lg">Daily at {reminder.reminder_time}</span>
              <div className="flex items-center gap-4 mt-1">
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  Email notifications enabled
                </p>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <Smartphone className="w-3 h-3" />
                  Push notifications active
                </p>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveReminder(reminder)}
            className="text-red-400 hover:text-red-600 hover:bg-red-100/80 rounded-xl p-3 transition-all duration-200 hover:scale-110"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default ActiveRemindersList;
