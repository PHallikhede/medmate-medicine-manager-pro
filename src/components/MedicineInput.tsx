
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface MedicineInputProps {
  onAddMedicine: (medicine: string) => void;
}

const MedicineInput = ({ onAddMedicine }: MedicineInputProps) => {
  const [medicine, setMedicine] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (medicine.trim() && user) {
      const { error } = await supabase.from("medicines").insert({
        name: medicine.trim(),
        user_id: user.id,
      });
      if (!error) {
        onAddMedicine(medicine.trim());
        setMedicine("");
        toast({
          title: "Medicine Added! 💊",
          description: `${medicine} has been added to your list`,
        });
      } else {
        toast({
          title: "Error",
          description: "Could not add medicine. Try again.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
      <div className="flex-1 relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-blue-400 to-green-400 rounded-full flex items-center justify-center">
            <Plus className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
          </div>
        </div>
        <Input
          type="text"
          value={medicine}
          onChange={(e) => setMedicine(e.target.value)}
          placeholder="Enter medicine name (e.g., Aspirin, Ibuprofen, Lisinopril)"
          className="pl-10 sm:pl-12 h-12 sm:h-14 lg:h-16 text-sm sm:text-base lg:text-lg border-2 border-blue-200/60 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl sm:rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-200 placeholder:text-slate-500 placeholder:font-medium text-slate-800"
          required
        />
      </div>
      <Button
        type="submit"
        disabled={!medicine.trim()}
        className="h-12 sm:h-14 lg:h-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-500 via-purple-600 to-green-600 hover:from-blue-600 hover:via-purple-700 hover:to-green-700 text-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm sm:text-base lg:text-lg w-full sm:w-auto"
      >
        <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
        Add Medicine
      </Button>
    </form>
  );
};

export default MedicineInput;
