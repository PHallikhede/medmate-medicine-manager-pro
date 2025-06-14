import { useEffect, useState } from "react";
import { X, Pill, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface MedicineListProps {
  medicines: string[];
  onRemoveMedicine: (index: number) => void;
}

const MedicineList = ({ medicines, onRemoveMedicine }: MedicineListProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [medicineList, setMedicineList] = useState<string[]>([]);

  // Fetch medicines from backend when user is ready
  useEffect(() => {
    async function fetchMedicines() {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("medicines")
        .select("name")
        .eq("user_id", user.id);
      if (data) {
        setMedicineList(data.map((m) => m.name));
      }
      setLoading(false);
    }
    fetchMedicines();
  }, [user]);

  const handleRemove = async (index: number) => {
    if (!user) return;
    const name = medicineList[index];
    // Remove from supabase
    await supabase.from("medicines")
      .delete()
      .eq("user_id", user.id)
      .eq("name", name);
    setMedicineList((prev) => prev.filter((_, i) => i !== index));
    onRemoveMedicine(index);
  };

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Loading...</div>;
  }
  if (medicineList.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <div className="relative inline-block">
          <Pill className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <Sparkles className="w-6 h-6 absolute -top-2 -right-2 text-blue-300 animate-pulse" />
        </div>
        <p className="text-lg font-medium mb-2">No medicines added yet</p>
        <p className="text-sm text-muted-foreground">Add your first medicine above to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {medicineList.map((medicine, index) => (
        <div
          key={index}
          className="group flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl border-2 border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-400 to-green-500 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-200">
              <Pill className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-foreground text-lg">{medicine}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRemove(index)}
            className="text-red-400 hover:text-red-600 hover:bg-red-100/80 rounded-xl p-3 transition-all duration-200 hover:scale-110"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default MedicineList;
