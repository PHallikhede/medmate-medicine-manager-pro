
import { useState } from "react";
import { Plus, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MedicineInputProps {
  onAddMedicine: (medicine: string) => void;
}

const MedicineInput = ({ onAddMedicine }: MedicineInputProps) => {
  const [medicineName, setMedicineName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (medicineName.trim()) {
      onAddMedicine(medicineName);
      setMedicineName("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4">
      <div className="flex-1 relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <Pill className="w-5 h-5 text-blue-400" />
        </div>
        <Input
          type="text"
          placeholder="Enter medicine name (e.g., Aspirin, Ibuprofen)"
          value={medicineName}
          onChange={(e) => setMedicineName(e.target.value)}
          className="pl-12 h-14 text-lg border-2 border-blue-200/60 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-200"
        />
      </div>
      <Button 
        type="submit" 
        className="h-14 px-8 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-600 hover:via-indigo-700 hover:to-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 border-0 font-semibold"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Medicine
      </Button>
    </form>
  );
};

export default MedicineInput;
