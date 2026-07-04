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
  Mail,
  Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SignInCardProps {
  setState: (state: SignInFlow) => void;
}

export const SignInCard = ({ setState }: SignInCardProps) => {
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  const onCredentialsSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsPending(true);
    signIn("password", { email, password, flow: "signIn" })
      .catch(() => setError("Invalid email or password"))
      .finally(() => setIsPending(false));
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Welcome back</h2>
        <p className="text-sm text-slate-400 mt-1">Sign in to continue</p>
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

      <form onSubmit={onCredentialsSignIn} className="space-y-4">
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

        <Button
          type="submit"
          className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg shadow-red-600/20 hover:shadow-red-600/30 transition-all disabled:opacity-70"
          disabled={isPending}
        >
          {isPending ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Signing in...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          )}
        </Button>
      </form>

      <p className="text-sm text-center text-slate-400">
        Don&apos;t have an account?{" "}
        <button
          onClick={() => setState("signUp")}
          className="text-red-600 hover:text-red-700 font-semibold hover:underline transition-all inline-flex items-center gap-1"
        >
          Sign up
          <ArrowRight className="w-3 h-3" />
        </button>
      </p>
    </div>
  );
};
