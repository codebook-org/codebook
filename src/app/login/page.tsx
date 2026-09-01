"use client";

import SignIn from "@/components/logincomponents/SignIn";
import CredSignIn from "@/components/logincomponents/CredSignIn";
import CredRegister from "@/components/logincomponents/CredRegister";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  // login or register modes
  const searchParams = useSearchParams();

  const [mode, setMode] = useState(
    searchParams.get("mode") === "register" ? "register" : "login",
  );

  return (
    <div className="flex w-full h-full mt-16 flex-col items-center bg-background">
      <div className="w-full max-w-md rounded-3xl border border-monaco-light bg-monaco-dark p-8 shadow-2xl backdrop-blur-md flex flex-col">
        <div className="tracking-wide text-monaco-txt font-semibold mb-2">
          {mode == "login" ? "Sign in" : "Create an account"}
        </div>
        <div className="w-full">
          {mode == "login" ? <CredSignIn /> : <CredRegister />}
        </div>
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
        {mode == "login" && (
          <div className="flex flex-col justify-center">
            <div className="h-[1px] w-full my-6 bg-monaco-light" />
            <SignIn />
          </div>
        )}
      </div>
    </div>
  );
}
