
import { useState } from "react";
import { Heart, Clock, AlertTriangle } from "lucide-react";
import MedicineInput from "@/components/MedicineInput";
import MedicineList from "@/components/MedicineList";
import InteractionChecker from "@/components/InteractionChecker";
import ReminderSection from "@/components/ReminderSection";

const Index = () => {
  const [medicines, setMedicines] = useState<string[]>([]);

  const addMedicine = (medicine: string) => {
    if (medicine.trim() && !medicines.includes(medicine.trim())) {
      setMedicines([...medicines, medicine.trim()]);
    }
  };

  const removeMedicine = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-xl">
              <Heart className="w-8 h-8 text-white" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">MedMate</h1>
              <p className="text-sm text-gray-600">Your personal medicine companion</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Medicine Input Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Heart className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Add Medicine</h2>
          </div>
          <MedicineInput onAddMedicine={addMedicine} />
        </div>

        {/* Current Medicines List */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Medicines</h2>
          <MedicineList medicines={medicines} onRemoveMedicine={removeMedicine} />
        </div>

        {/* Check Interactions Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-orange-100 p-2 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Drug Interactions</h2>
          </div>
          <InteractionChecker medicines={medicines} />
        </div>

        {/* Reminder Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-green-100 p-2 rounded-lg">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Set Reminder</h2>
          </div>
          <ReminderSection />
        </div>
      </main>
    </div>
  );
};

export default Index;
