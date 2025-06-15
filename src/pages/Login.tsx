
import { useNavigate } from "react-router-dom";
import { Heart, ArrowRight, MessageCircle, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import AIChatBot from "@/components/AIChatBot";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-3 sm:p-4 lg:p-6">
      <AIChatBot />
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80 bg-gradient-to-br from-blue-200/20 to-green-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80 bg-gradient-to-tr from-green-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
      </div>
      
      <div className="relative w-full max-w-md lg:max-w-lg">
        {/* Logo and Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center mb-3 sm:mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-green-500 p-3 sm:p-4 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Heart className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" fill="currentColor" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-1 sm:mb-2">
            MedMate
          </h1>
          <p className="text-slate-600 text-sm sm:text-base lg:text-lg font-medium">
            Your personal medicine companion with AI assistance
          </p>
        </div>

        {/* Welcome Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8 border border-slate-200/50 hover:shadow-2xl transition-all duration-300">
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 mb-1 sm:mb-2">Welcome to MedMate!</h2>
            <p className="text-slate-600 text-sm sm:text-base font-medium">
              Manage your medicines, check interactions, set reminders, and chat with our AI assistant.
            </p>
          </div>

          <Button 
            onClick={() => navigate("/auth")}
            className="w-full h-11 sm:h-12 lg:h-14 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base lg:text-lg"
          >
            Get Started
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
          </Button>
        </div>

        {/* Features */}
        <div className="mt-4 sm:mt-6 lg:mt-8 grid grid-cols-1 gap-3 sm:gap-4 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-200/50 hover:bg-white/90 transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />
              </div>
              <div className="text-left min-w-0 flex-1">
                <p className="font-semibold text-slate-800 text-sm sm:text-base">AI Health Assistant</p>
                <p className="text-xs sm:text-sm text-slate-600">Get instant answers to your health questions</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-200/50 hover:bg-white/90 transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600" />
              </div>
              <div className="text-left min-w-0 flex-1">
                <p className="font-semibold text-slate-800 text-sm sm:text-base">Medicine Reminders</p>
                <p className="text-xs sm:text-sm text-slate-600">Never miss your medication again</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-200/50 hover:bg-white/90 transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-orange-600" />
              </div>
              <div className="text-left min-w-0 flex-1">
                <p className="font-semibold text-slate-800 text-sm sm:text-base">Drug Interaction Checker</p>
                <p className="text-xs sm:text-sm text-slate-600">Stay safe with interaction alerts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
