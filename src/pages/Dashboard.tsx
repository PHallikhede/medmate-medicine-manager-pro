
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Clock, AlertTriangle, Sparkles, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import MedicineInput from "@/components/MedicineInput";
import MedicineList from "@/components/MedicineList";
import InteractionChecker from "@/components/InteractionChecker";
import ReminderSection from "@/components/ReminderSection";
import AIChatBot from "@/components/AIChatBot";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const [medicines, setMedicines] = useState<string[]>([]);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const addMedicine = (medicine: string) => {
    setMedicines([...medicines, medicine]);
  };

  const removeMedicine = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      <AIChatBot />
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80 bg-gradient-to-br from-blue-200/20 to-green-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80 bg-gradient-to-tr from-green-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-r from-blue-100/10 to-green-100/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-500 to-green-500 p-2 sm:p-3 rounded-2xl shadow-lg">
                  <Heart className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" fill="currentColor" />
                </div>
                <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  MedMate
                </h1>
                <p className="text-xs sm:text-sm text-slate-700 font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                  Your personal medicine companion
                </p>
              </div>
            </div>

            {/* Account Details */}
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 lg:gap-4 w-full sm:w-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2 sm:p-3 lg:p-4 border border-slate-200 shadow-sm w-full sm:w-auto">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="bg-gradient-to-br from-blue-100 to-green-100 p-1 sm:p-2 rounded-lg sm:rounded-xl">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div className="text-xs sm:text-sm min-w-0 flex-1">
                    <p className="font-semibold text-slate-800">Welcome back!</p>
                    <p className="text-slate-600 truncate max-w-[200px] sm:max-w-[250px]">{user?.email}</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleLogout}
                variant="outline"
                className="h-10 sm:h-11 lg:h-12 px-3 sm:px-4 bg-white/70 backdrop-blur-sm border-2 border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-700 hover:text-red-600 rounded-lg sm:rounded-xl shadow-sm transition-all duration-200 text-sm font-medium w-full sm:w-auto"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Medicine Input Section */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6 lg:p-8 border border-slate-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-2 sm:p-3 rounded-xl">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800">Add Medicine</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent"></div>
          </div>
          <MedicineInput onAddMedicine={addMedicine} />
        </div>

        {/* Current Medicines List */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6 lg:p-8 border border-slate-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="bg-gradient-to-br from-green-100 to-green-200 p-2 sm:p-3 rounded-xl">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600" />
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800">Your Medicines</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-green-200 to-transparent"></div>
          </div>
          <MedicineList medicines={medicines} onRemoveMedicine={removeMedicine} />
        </div>

        {/* Check Interactions Section */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6 lg:p-8 border border-slate-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-2 sm:p-3 rounded-xl">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-orange-600" />
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800">Drug Interactions</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-orange-200 to-transparent"></div>
          </div>
          <InteractionChecker medicines={medicines} />
        </div>

        {/* Reminder Section */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6 lg:p-8 border border-slate-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="bg-gradient-to-br from-blue-100 to-green-200 p-2 sm:p-3 rounded-xl">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800">Set Reminder</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent"></div>
          </div>
          <ReminderSection />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
