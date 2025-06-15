
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { NotificationService } from "@/services/NotificationService";

export const useReminders = () => {
  const { user } = useAuth();
  const [activeReminders, setActiveReminders] = useState<any[]>([]);
  const { toast } = useToast();

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

  const setReminder = async (reminderTime: string, email: string) => {
    if (reminderTime && email && user) {
      const hasPermission = await NotificationService.requestPermissions();
      
      if (!hasPermission) {
        toast({
          title: "Permission Required",
          description: "Please allow notifications to receive medicine reminders on your device",
          variant: "destructive"
        });
        return false;
      }
      
      const { data, error } = await supabase.from("reminders").insert({
        user_id: user.id,
        reminder_time: reminderTime,
        is_active: true,
      }).select().single();

      if (!error && data) {
        const { data: medicines } = await supabase
          .from("medicines")
          .select("name")
          .eq("user_id", user.id);

        const medicineNames = medicines?.map(m => m.name) || [];

        const reminderDate = new Date();
        const [hours, minutes] = reminderTime.split(':');
        reminderDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        if (reminderDate <= new Date()) {
          reminderDate.setDate(reminderDate.getDate() + 1);
        }

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
        return true;
      } else {
        toast({
          title: "Error",
          description: "Could not set reminder. Try again.",
          variant: "destructive"
        });
        return false;
      }
    }
    return false;
  };

  const removeReminder = async (reminder: any) => {
    if (!user) return;
    
    await NotificationService.cancelReminder(Number(reminder.id));
    
    await supabase.from("reminders")
      .delete()
      .eq("id", reminder.id);
    
    setActiveReminders(activeReminders.filter(r => r.id !== reminder.id));
    toast({
      title: "Reminder Removed",
      description: "Medicine reminder and notifications have been cancelled",
    });
  };

  return {
    activeReminders,
    setReminder,
    removeReminder
  };
};
