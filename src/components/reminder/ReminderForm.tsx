
import { useState } from "react";
import { Bell, Clock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

interface ReminderFormProps {
  onSetReminder: (reminderTime: string, email: string) => Promise<boolean>;
}

const ReminderForm = ({ onSetReminder }: ReminderFormProps) => {
  const { user } = useAuth();
  const [reminderTime, setReminderTime] = useState("");
  const [email, setEmail] = useState(user ? user.email ?? "" : "");
  const [isSettingReminder, setIsSettingReminder] = useState(false);

  const handleSetReminder = async () => {
    setIsSettingReminder(true);
    const success = await onSetReminder(reminderTime, email);
    if (success) {
      setReminderTime("");
    }
    setIsSettingReminder(false);
  };

  return (
    <div className="space-y-4">
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
          onClick={handleSetReminder}
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
    </div>
  );
};

export default ReminderForm;
