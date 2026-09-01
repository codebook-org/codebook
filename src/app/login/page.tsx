"use client";

import GoogleSignIn from "@/components/logincomponents/GoogleSignIn";
import CredSignIn from "@/components/logincomponents/CredSignIn";
import CredRegister from "@/components/logincomponents/CredRegister";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { KeySquare, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  // login or register modes
  const searchParams = useSearchParams();

  const [mode, setMode] = useState(
    searchParams.get("mode") === "register" ? "register" : "login",
  );

  return (
    <div className="flex w-full h-full mt-16 flex-col items-center bg-background">
      <div
        className="w-full max-w-md rounded-3xl border border-monaco-light bg-monaco-dark p-8 shadow-2xl backdrop-blur-md flex flex-col"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: mode == "login" ? -15 : 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: mode == "login" ? -15 : 15 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full"
          >
            <div className="tracking-wide text-monaco-txt font-semibold mb-2">
              {mode == "login" ? (
                <div className="flex items-center">
                  <KeySquare className="size-5 mr-3" />
                  Sign in
                </div>
              ) : (
                <div className="flex items-center">
                  <User className="size-5 mr-3" />
                  Create an account
                </div>
              )}
            </div>
            {mode == "login" ? <CredSignIn /> : <CredRegister />}
            <div className="text-xs text-monaco-muted text-center mt-2">
              {mode == "login"
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                onClick={() => setMode(mode == "login" ? "register" : "login")}
                className="font-medium hover:text-blue-500 transition-colors cursor-pointer underline transition-colors"
              >
                {mode == "login" ? "Register" : "Sign in"}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="h-[1px] w-full my-6 bg-monaco-light" />
        <GoogleSignIn />
      </div>
    </div>
  );
}
