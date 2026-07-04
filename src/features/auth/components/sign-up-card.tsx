import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SignInFlow } from "../types";
import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import {
  Eye,
  EyeOff,
  TriangleAlert,
  ArrowRight,
  User,
  Mail,
  Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SignUpCardProps {
  setState: (state: SignInFlow) => void;
}

export const SignUpCard = ({ setState }: SignUpCardProps) => {
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  const onCredentialsSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsPending(true);
    signIn("password", { name, email, password, flow: "signUp" })
      .catch(() => setError("Something went wrong. Please try again."))
      .finally(() => setIsPending(false));
  };

  const strength = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();

  const colors = [
    "bg-slate-200",
    "bg-red-400",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-green-500",
  ];
  const labels = ["", "Weak", "Fair", "Good", "Strong"];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Create account</h2>
        <p className="text-sm text-slate-400 mt-1">
          Join our community of life-savers
        </p>
      </div>

      <AnimatePresence>
        {!!error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 text-sm"
          >
            <TriangleAlert className="w-4 h-4 shrink-0" />
            <span className="font-medium">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={onCredentialsSignUp} className="space-y-3">
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors">
            <User className="w-5 h-5" />
          </div>
          <Input
            disabled={isPending}
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="h-12 pl-11 bg-slate-50/50 border-slate-200 rounded-xl focus:bg-white focus:border-red-200 focus:ring-4 focus:ring-red-500/10 transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors">
            <Mail className="w-5 h-5" />
          </div>
          <Input
            disabled={isPending}
            value={email}
            required
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="h-12 pl-11 bg-slate-50/50 border-slate-200 rounded-xl focus:bg-white focus:border-red-200 focus:ring-4 focus:ring-red-500/10 transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="space-y-1.5">
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors">
              <Lock className="w-5 h-5" />
            </div>
            <Input
              disabled={isPending}
              value={password}
              required
              type={showPassword ? "text" : "password"}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="h-12 pl-11 pr-12 bg-slate-50/50 border-slate-200 rounded-xl focus:bg-white focus:border-red-200 focus:ring-4 focus:ring-red-500/10 transition-all placeholder:text-slate-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              disabled={isPending}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {password && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-1"
            >
              <div className="flex gap-1 h-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-full transition-all ${i <= strength ? colors[strength] : "bg-slate-200"}`}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-400">
                Strength:{" "}
                <span
                  className={`font-medium ${strength >= 3 ? "text-green-600" : strength >= 2 ? "text-orange-500" : "text-red-500"}`}
                >
                  {labels[strength]}
                </span>
              </p>
            </motion.div>
          )}
        </div>

        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors">
            <Lock className="w-5 h-5" />
          </div>
          <Input
            disabled={isPending}
            value={confirmPassword}
            required
            type={showConfirmPassword ? "text" : "password"}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            className="h-12 pl-11 pr-12 bg-slate-50/50 border-slate-200 rounded-xl focus:bg-white focus:border-red-200 focus:ring-4 focus:ring-red-500/10 transition-all placeholder:text-slate-400"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((p) => !p)}
            disabled={isPending}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg shadow-red-600/20 hover:shadow-red-600/30 transition-all disabled:opacity-70"
          disabled={isPending}
        >
          {isPending ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Creating...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>Create account</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          )}
        </Button>
      </form>

      <p className="text-sm text-center text-slate-400">
        Already have an account?{" "}
        <button
          onClick={() => setState("signIn")}
          className="text-red-600 hover:text-red-700 font-semibold hover:underline transition-all inline-flex items-center gap-1"
        >
          Sign in
          <ArrowRight className="w-3 h-3" />
        </button>
      </p>
    </div>
  );
};
