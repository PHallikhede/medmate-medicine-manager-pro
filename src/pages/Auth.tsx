
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Heart, Lock, User, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AuthPage = () => {
  const { signUp, signIn, user, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  if (!loading && user) {
    // Already authenticated—redirect to dashboard
    setTimeout(() => navigate("/dashboard"), 0);
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setErrorMsg(null);
    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) setErrorMsg(error.message || "Login failed");
    } else {
      const { error } = await signUp(email, password);
      if (error) setErrorMsg(error.message || "Signup failed. Check your email for confirmation if required.");
      else setErrorMsg("Check your email for confirmation!");
    }
    setPending(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-6">
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-green-500 p-4 rounded-3xl shadow-lg">
              <Heart className="w-12 h-12 text-white" fill="currentColor" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
            MedMate
          </h1>
          <p className="text-muted-foreground text-lg">
            {isLogin ? "Login to continue" : "Create your account"}
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-slate-200/50 transition-all duration-300">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                <Input
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={pending}
                  className="pl-12 h-12 border-2 border-slate-300"
                  required
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
                <Input
                  type="password"
                  placeholder="Password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={pending}
                  className="pl-12 h-12 border-2 border-slate-300"
                  required
                />
              </div>
              {errorMsg && (
                <div className="text-red-600 bg-red-50 rounded-lg p-3 text-sm">
                  {errorMsg}
                </div>
              )}
            </div>
            <Button
              type="submit"
              disabled={pending}
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl shadow-lg transition-all duration-200"
            >
              {pending ? "Processing..." : isLogin ? "Login" : "Sign Up"}
              <ArrowRight className="inline-block w-5 h-5 ml-2" />
            </Button>
          </form>
          <div className="mt-4 text-center">
            {isLogin ? (
              <span>
                Don't have an account?{" "}
                <button
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-all duration-200"
                  onClick={() => setIsLogin(false)}
                  disabled={pending}
                >
                  Sign up
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{" "}
                <button
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-all duration-200"
                  onClick={() => setIsLogin(true)}
                  disabled={pending}
                >
                  Login
                </button>
              </span>
            )}
          </div>
        </div>
        <div className="mt-6 text-center">
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            className="text-slate-500 mx-auto"
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
