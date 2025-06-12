
import { X, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MedicineListProps {
  medicines: string[];
  onRemoveMedicine: (index: number) => void;
}

const MedicineList = ({ medicines, onRemoveMedicine }: MedicineListProps) => {
  if (medicines.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Pill className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>No medicines added yet</p>
        <p className="text-sm">Add your first medicine above</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {medicines.map((medicine, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="bg-blue-200 p-2 rounded-lg">
              <Pill className="w-4 h-4 text-blue-700" />
            </div>
            <span className="font-medium text-gray-900">{medicine}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveMedicine(index)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default MedicineList;
