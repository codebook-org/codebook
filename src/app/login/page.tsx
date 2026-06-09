"use client";

// This is for OAuth Login
import SignIn from "@/components/logincomponents/SignIn";
import SignOut from "@/components/logincomponents/SignOut";

// This is for Credential Login
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
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-black px-4 font-sans text-white">
      <h1 className="mb-8 text-2xl font-bold tracking-tight text-zinc-400">
        welcome to <span className="text-orange-400">codebook.</span>
      </h1>

      {/* The entire thing idotknow IMSLEEPY */}
      <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-md flex flex-col">
        <h3 className="mb-6 text-xl font-semibold tracking-wide text-zinc-100 text-center">
          {mode == "login" ? "Welcome Back" : "Create Account"}
        </h3>

        {/* Which one are we? Are we loggin in or creating? */}
        <div className="w-full mb-6">
          {mode == "login" ? <CredSignIn /> : <CredRegister />}
        </div>

        {/* "Button" to toggle login/register state */}
        <div className="text-sm text-zinc-400 text-center border-t border-zinc-800/60 pt-4">
          {mode == "login"
            ? "Don't have an account? "
            : "Already have an account? "}
          <button
            onClick={() => setMode(mode == "login" ? "register" : "login")}
            className="text-orange-400 font-medium hover:text-orange-300 underline underline-offset-4 transition-colors ml-1"
          >
            {mode == "login" ? "Register" : "Login"}
          </button>
        </div>
      </div>

      {/* Social Provider OAuth Lower Tray */}
      <div className="mt-8 flex items-center gap-4 border-t border-zinc-900 pt-6">
        <SignIn />
      </div>
    </div>
  );
}
