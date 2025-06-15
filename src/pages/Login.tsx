import { useNavigate } from "react-router-dom";
import { Heart, ArrowRight, MessageCircle, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import AIChatBot from "@/components/AIChatBot";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-6">
      <AIChatBot />
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-green-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
      </div>
      <div className="relative w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-green-500 p-4 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Heart className="w-12 h-12 text-white" fill="currentColor" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
            MedMate
          </h1>
          <p className="text-muted-foreground text-lg">
            Your personal medicine companion with AI assistance
          </p>
        </div>

        {/* Welcome Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-slate-200/50 hover:shadow-2xl transition-all duration-300">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to MedMate!</h2>
            <p className="text-muted-foreground">
              Manage your medicines, check interactions, set reminders, and chat with our AI assistant.
            </p>
          </div>

          <Button 
            onClick={() => navigate("/auth")}
            className="w-full h-12 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Get Started
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 gap-4 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/50 hover:bg-white/80 transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">AI Health Assistant</p>
                <p className="text-sm text-muted-foreground">Get instant answers to your health questions</p>
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/50 hover:bg-white/80 transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">Medicine Reminders</p>
                <p className="text-sm text-muted-foreground">Never miss your medication again</p>
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/50 hover:bg-white/80 transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-orange-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">Drug Interaction Checker</p>
                <p className="text-sm text-muted-foreground">Stay safe with interaction alerts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
