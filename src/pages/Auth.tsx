
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Heart, User, ArrowRight, ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AIChatBot from "@/components/AIChatBot";

const AuthPage = () => {
  const { signUp, signIn, user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const navigate = useNavigate();

  if (!loading && user) {
    setTimeout(() => navigate("/dashboard"), 0);
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setErrorMsg(null);

    let error;
    if (mode === "signup") {
      const resp = await signUp(email, password);
      error = resp.error;
    } else {
      const resp = await signIn(email, password);
      error = resp.error;
    }

    if (error) {
      setErrorMsg(error.message || (mode === "signup" ? "Signup failed" : "Login failed"));
    }
    setPending(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-3 sm:p-4 lg:p-6">
      <AIChatBot />
      <div className="relative w-full max-w-md lg:max-w-lg">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center mb-3 sm:mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-green-500 p-3 sm:p-4 rounded-3xl shadow-lg">
              <Heart className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" fill="currentColor" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
            MedMate
          </h1>
          <div className="mx-auto mb-2 h-1 w-16 sm:w-20 lg:w-24 rounded-full bg-slate-800" />
          <p className="text-slate-600 text-sm sm:text-base lg:text-lg font-medium">
            {mode === "signup"
              ? "Create your account to get started"
              : "Login to your account"}
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8 border border-slate-200/50 transition-all duration-300">
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-3 sm:space-y-4">
              <div className="relative group">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                <Input
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={pending}
                  className="pl-10 sm:pl-12 h-11 sm:h-12 lg:h-14 border-2 border-slate-300 focus:border-blue-400 text-slate-800 placeholder:text-slate-500 text-sm sm:text-base"
                  required
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                <Input
                  type="password"
                  placeholder={mode === "signup" ? "Password (at least 6 characters)" : "Password"}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={pending}
                  className="pl-10 sm:pl-12 h-11 sm:h-12 lg:h-14 border-2 border-slate-300 focus:border-blue-400 text-slate-800 placeholder:text-slate-500 text-sm sm:text-base"
                  required
                  minLength={6}
                />
              </div>
              {errorMsg && (
                <div className="text-red-700 bg-red-50 border border-red-200 rounded-lg p-3 text-sm font-medium">
                  {errorMsg}
                </div>
              )}
            </div>
            <Button
              type="submit"
              disabled={pending}
              className="w-full h-11 sm:h-12 lg:h-14 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white rounded-xl shadow-lg transition-all duration-200 font-semibold text-sm sm:text-base"
            >
              {pending
                ? mode === "signup"
                  ? "Creating Account..."
                  : "Logging in..."
                : mode === "signup"
                  ? "Create Account"
                  : "Log In"}
              <ArrowRight className="inline-block w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>
          </form>
          <div className="flex justify-center mt-4 sm:mt-6">
            <Button
              type="button"
              variant="ghost"
              className="text-slate-600 hover:text-slate-800 font-medium text-sm sm:text-base"
              onClick={() => setMode(mode === "signup" ? "login" : "signup")}
            >
              {mode === "signup"
                ? "Already have an account? Log in"
                : "Need an account? Sign up"}
            </Button>
          </div>
        </div>
        <div className="mt-4 sm:mt-6 text-center">
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            className="text-slate-600 hover:text-slate-800 mx-auto font-medium text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
