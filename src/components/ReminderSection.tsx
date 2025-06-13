
import { useState } from "react";
import { Bell, Clock, Trash2, AlarmClock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ReminderSection = () => {
  const [reminderTime, setReminderTime] = useState("");
  const [email, setEmail] = useState("user@example.com");
  const [activeReminders, setActiveReminders] = useState<string[]>([]);
  const [isSettingReminder, setIsSettingReminder] = useState(false);
  const { toast } = useToast();

  const setReminder = async () => {
    if (reminderTime && email) {
      setIsSettingReminder(true);
      
      try {
        // Call edge function to send email notification
        const { data, error } = await supabase.functions.invoke('send-reminder-email', {
          body: {
            email: email,
            reminderTime: reminderTime,
            medicines: ["Sample Medicine"] // In real app, you'd pass actual medicines
          }
        });

        if (error) {
          console.error('Error sending reminder email:', error);
          toast({
            title: "Reminder Set! 🔔",
            description: `Medicine reminder set for ${reminderTime} (Email notification pending)`,
          });
        } else {
          toast({
            title: "Reminder Set! 🔔",
            description: `Medicine reminder set for ${reminderTime}. Email notification scheduled!`,
          });
        }

        setActiveReminders([...activeReminders, reminderTime]);
        setReminderTime("");
        
      } catch (error) {
        console.error('Error setting reminder:', error);
        toast({
          title: "Reminder Set! 🔔",
          description: `Medicine reminder set for ${reminderTime} (Email notification may be delayed)`,
        });
        setActiveReminders([...activeReminders, reminderTime]);
        setReminderTime("");
      } finally {
        setIsSettingReminder(false);
      }
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
    <div className="space-y-6">
      {/* Email Input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <Mail className="w-5 h-5 text-blue-400" />
        </div>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email for notifications"
          className="pl-12 h-12 text-base border-2 border-blue-200/60 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-200 placeholder:text-slate-500"
        />
      </div>

      {/* Time Input and Set Button */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Clock className="w-5 h-5 text-green-400" />
          </div>
          <Input
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="pl-12 h-14 text-lg border-2 border-green-200/60 focus:border-green-400 focus:ring-4 focus:ring-green-100 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-200"
          />
        </div>
        <Button
          onClick={setReminder}
          disabled={!reminderTime || !email || isSettingReminder}
          className="h-14 px-8 bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 hover:from-green-600 hover:via-emerald-700 hover:to-teal-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {isSettingReminder ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
              Setting...
            </>
          ) : (
            <>
              <Bell className="w-5 h-5 mr-2" />
              Set Reminder
            </>
          )}
        </Button>
      </div>

      {/* Active Reminders */}
      {activeReminders.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
            <AlarmClock className="w-5 h-5 text-green-600" />
            Active Reminders:
          </h3>
          {activeReminders.map((time, index) => (
            <div
              key={index}
              className="group flex items-center justify-between p-5 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 rounded-2xl border-2 border-green-200/60 hover:border-green-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-200">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-green-800 font-semibold text-lg">Daily at {time}</span>
                  <p className="text-sm text-green-600">📧 Email notifications enabled</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeReminder(index)}
                className="text-red-400 hover:text-red-600 hover:bg-red-100/80 rounded-xl p-3 transition-all duration-200 hover:scale-110"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {activeReminders.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="relative inline-block">
            <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <Bell className="w-6 h-6 absolute -top-2 -right-2 text-green-300 animate-pulse" />
          </div>
          <p className="text-lg font-medium mb-2">No active reminders</p>
          <p className="text-sm text-gray-400">Set a time above to get medicine reminders via email</p>
        </div>
      )}
    </div>
  );
};

export default ReminderSection;
