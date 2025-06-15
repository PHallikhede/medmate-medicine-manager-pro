import { useState, useEffect } from "react";
import { Bell, Clock, Trash2, AlarmClock, Mail, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { NotificationService } from "@/services/NotificationService";

const ReminderSection = () => {
  const { user } = useAuth();
  const [reminderTime, setReminderTime] = useState("");
  const [email, setEmail] = useState(user ? user.email ?? "" : "");
  const [activeReminders, setActiveReminders] = useState<any[]>([]);
  const [isSettingReminder, setIsSettingReminder] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(false);
  const { toast } = useToast();

  // Check notification permissions on mount
  useEffect(() => {
    checkNotificationPermission();
  }, []);

  const checkNotificationPermission = async () => {
    try {
      // Check current status without requesting
      const currentStatus = NotificationService.getPermissionStatus();
      setNotificationPermission(currentStatus === 'granted');
      
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

  // Fetch reminders for this user
  useEffect(() => {
    async function fetchReminders() {
      if (!user) return;
      const { data, error } = await supabase
        .from("reminders")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true);
      if (data) {
        setActiveReminders(data);
      }
    }
    fetchReminders();
  }, [user]);

  const setReminder = async () => {
    if (reminderTime && email && user) {
      // Always request permissions when setting a reminder to trigger popup
      const hasPermission = await NotificationService.requestPermissions();
      
      if (!hasPermission) {
        toast({
          title: "Permission Required",
          description: "Please allow notifications to receive medicine reminders on your device",
          variant: "destructive"
        });
        return;
      }
      
      setNotificationPermission(true);
      setIsSettingReminder(true);
      
      // Insert reminder for user
      const { data, error } = await supabase.from("reminders").insert({
        user_id: user.id,
        reminder_time: reminderTime,
        is_active: true,
      }).select().single();

      if (!error && data) {
        // Get user's medicines for the notification
        const { data: medicines } = await supabase
          .from("medicines")
          .select("name")
          .eq("user_id", user.id);

        const medicineNames = medicines?.map(m => m.name) || [];

        // Schedule local notification
        const reminderDate = new Date();
        const [hours, minutes] = reminderTime.split(':');
        reminderDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        // If the time is for today but already passed, schedule for tomorrow
        if (reminderDate <= new Date()) {
          reminderDate.setDate(reminderDate.getDate() + 1);
        }

        // Fix: Convert data.id to number for the notification ID
        await NotificationService.scheduleReminder(
          Number(data.id),
          "💊 Medicine Reminder - MedMate",
          `Time to take your medicines: ${medicineNames.join(', ') || 'Check your medicine list'}`,
          reminderDate,
          medicineNames
        );

        toast({
          title: "Reminder Set! 🔔📱",
          description: `Medicine reminder set for ${reminderTime}. You'll receive notifications on your device!`,
        });
        
        setActiveReminders([...activeReminders, data]);
        setReminderTime("");
      } else {
        toast({
          title: "Error",
          description: "Could not set reminder. Try again.",
          variant: "destructive"
        });
      }

      setIsSettingReminder(false);
    }
  };

  const removeReminder = async (reminder: any) => {
    if (!user) return;
    
    // Fix: Convert reminder.id to number for the notification cancellation
    await NotificationService.cancelReminder(Number(reminder.id));
    
    // Remove from database
    await supabase.from("reminders")
      .delete()
      .eq("id", reminder.id);
    
    setActiveReminders(activeReminders.filter(r => r.id !== reminder.id));
    toast({
      title: "Reminder Removed",
      description: "Medicine reminder and notifications have been cancelled",
    });
  };

  const testNotification = async () => {
    // Always request permissions for test to trigger popup
    const hasPermission = await NotificationService.requestPermissions();
    
    if (!hasPermission) {
      toast({
        title: "Permission Required",
        description: "Please allow notifications to test alerts. Look for the popup in your browser!",
        variant: "destructive"
      });
      return;
    }
    
    setNotificationPermission(true);

    await NotificationService.showInstantNotification(
      "💊 Test Notification - MedMate",
      "This is how your medicine reminders will look!"
    );

    toast({
      title: "Test Notification Sent! 📱",
      description: "Check your device for the notification",
    });
  };

  return (
    <div className="space-y-6">
      {/* Notification Status */}
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
            onClick={testNotification}
            size="sm"
            variant={notificationPermission ? "default" : "outline"}
            className="shrink-0"
          >
            Test Alert
          </Button>
        </div>
      </div>

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
                onClick={() => removeReminder(reminder)}
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
          <p className="text-sm text-gray-400">Set a time above to get medicine reminders via email and push notifications</p>
        </div>
      )}
    </div>
  );
};

export default ReminderSection;
