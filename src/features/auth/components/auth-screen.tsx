"use client";

import { useState } from "react";
import { SignInFlow } from "../types";
import { SignInCard } from "./sign-in-card";
import { SignUpCard } from "./sign-up-card";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets } from "lucide-react";
import { BloodDonationAnimation } from "./blood-donation-animation";

export const AuthScreen = () => {
  const [state, setState] = useState<SignInFlow>("signIn");

  return (
    <div className="h-screen w-full flex overflow-hidden bg-white">
      {/* Left Side — Auth Forms */}
      <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-[400px] relative">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 shadow-xl shadow-red-600/20 mb-5">
              <Droplets className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-1.5">
              Blood<span className="text-red-600">Connect</span>
            </h1>
            <p className="text-sm text-slate-400 font-medium">
              Saving lives, one donation at a time
            </p>
          </motion.div>

          {/* Auth Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="bg-white rounded-3xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] border border-slate-100 p-8"
          >
            <AnimatePresence mode="wait">
              {state === "signIn" ? (
                <motion.div
                  key="signin"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.25 }}
                >
                  <SignInCard setState={setState} />
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <SignUpCard setState={setState} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Right Side — Living Blood Donation Animation */}
      <div className="hidden lg:block lg:w-[55%] xl:w-[60%] relative overflow-hidden bg-gradient-to-br from-[#fef2f2] via-[#fff1f2] to-[#ffe4e6]">
        <BloodDonationAnimation />
      </div>
    </div>
  );
};
