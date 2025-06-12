
import { useState } from "react";
import { Bell, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const ReminderSection = () => {
  const [reminderTime, setReminderTime] = useState("");
  const [activeReminders, setActiveReminders] = useState<string[]>([]);
  const { toast } = useToast();

  const setReminder = () => {
    if (reminderTime) {
      setActiveReminders([...activeReminders, reminderTime]);
      toast({
        title: "Reminder Set!",
        description: `Medicine reminder set for ${reminderTime}`,
      });
      setReminderTime("");
    }
  };

  const removeReminder = (index: number) => {
    setActiveReminders(activeReminders.filter((_, i) => i !== index));
    toast({
      title: "Reminder Removed",
      description: "Medicine reminder has been cancelled",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Input
          type="time"
          value={reminderTime}
          onChange={(e) => setReminderTime(e.target.value)}
          className="flex-1 border-green-200 focus:border-green-500 focus:ring-green-500"
        />
        <Button
          onClick={setReminder}
          disabled={!reminderTime}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6"
        >
          <Bell className="w-4 h-4 mr-2" />
          Set Reminder
        </Button>
      </div>

      {activeReminders.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium text-gray-900">Active Reminders:</h3>
          {activeReminders.map((time, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-600" />
                <span className="text-green-800">Daily at {time}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeReminder(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                Cancel
              </Button>
            </div>
          ))}
        </div>
      )}

      {activeReminders.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p>No active reminders</p>
          <p className="text-sm">Set a time above to get medicine reminders</p>
        </div>
      )}
    </div>
  );
};

export default ReminderSection;
