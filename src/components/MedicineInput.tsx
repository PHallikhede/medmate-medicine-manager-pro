
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
    <form onSubmit={handleSubmit} className="flex gap-4">
      <div className="flex-1 relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <div className="w-5 h-5 bg-gradient-to-r from-blue-400 to-green-400 rounded-full flex items-center justify-center">
            <Plus className="w-3 h-3 text-white" />
          </div>
        </div>
        <Input
          type="text"
          value={medicine}
          onChange={(e) => setMedicine(e.target.value)}
          placeholder="Enter medicine name (e.g., Aspirin, Ibuprofen, Lisinopril)"
          className="pl-12 h-14 text-lg border-2 border-blue-200/60 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-200 placeholder:text-slate-500 placeholder:font-medium"
          required
        />
      </div>
      <Button
        type="submit"
        disabled={!medicine.trim()}
        className="h-14 px-8 bg-gradient-to-r from-blue-500 via-purple-600 to-green-600 hover:from-blue-600 hover:via-purple-700 hover:to-green-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Medicine
      </Button>
    </form>
  );
};

export default MedicineInput;
