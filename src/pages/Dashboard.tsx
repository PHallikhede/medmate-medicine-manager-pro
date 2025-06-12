
import { useState } from "react";
import { Heart, Clock, AlertTriangle, Sparkles } from "lucide-react";
import MedicineInput from "@/components/MedicineInput";
import MedicineList from "@/components/MedicineList";
import InteractionChecker from "@/components/InteractionChecker";
import ReminderSection from "@/components/ReminderSection";

const Dashboard = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-green-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-200/20 to-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-100/10 to-green-100/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-lg shadow-lg border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-green-500 p-3 rounded-2xl shadow-lg">
                <Heart className="w-10 h-10 text-white" fill="currentColor" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                MedMate
              </h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-blue-500" />
                Your personal medicine companion
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Medicine Input Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-slate-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-xl">
              <Heart className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Add Medicine</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent"></div>
          </div>
          <MedicineInput onAddMedicine={addMedicine} />
        </div>

        {/* Current Medicines List */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-slate-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-green-100 to-green-200 p-3 rounded-xl">
              <Heart className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Your Medicines</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-green-200 to-transparent"></div>
          </div>
          <MedicineList medicines={medicines} onRemoveMedicine={removeMedicine} />
        </div>

        {/* Check Interactions Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-slate-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-3 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Drug Interactions</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-orange-200 to-transparent"></div>
          </div>
          <InteractionChecker medicines={medicines} />
        </div>

        {/* Reminder Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-slate-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-blue-100 to-green-200 p-3 rounded-xl">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Set Reminder</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent"></div>
          </div>
          <ReminderSection />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
