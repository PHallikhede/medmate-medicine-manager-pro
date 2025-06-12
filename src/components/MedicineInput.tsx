
import { useState } from "react";
import { Plus } from "lucide-react";
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
    <form onSubmit={handleSubmit} className="flex gap-3">
      <Input
        type="text"
        placeholder="Enter medicine name (e.g., Aspirin, Ibuprofen)"
        value={medicineName}
        onChange={(e) => setMedicineName(e.target.value)}
        className="flex-1 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
      />
      <Button 
        type="submit" 
        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add
      </Button>
    </form>
  );
};

export default MedicineInput;
