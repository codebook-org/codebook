"use client";

// This is for OAuth
import SignIn from "@/components/logincomponents/SignIn";
import SignOut from "@/components/logincomponents/SignOut";

// This is for Credential
import CredSignIn from "@/components/logincomponents/CredSignIn";
import CredRegister from "@/components/logincomponents/CredRegister";

import { useState } from "react";

export default function loginPage() {
  // Do we want to log in (default) or register a new credential login?
  const [mode, setMode] = useState("login");

  return (
    <div>
      Welcome to Codebook.
      {/* This is where we'll store all of our credential stuff. */}
      <div>
        <h3> {mode == "login" ? "Welcome Back" : "Create Account"} </h3>

        {mode == "login" ? <CredSignIn /> : <CredRegister />}

        {mode == "login"
          ? "Don't have an account?"
          : "Already have an account?"}
        <button onClick={() => setMode(mode == "login" ? "register" : "login")}>
          {mode == "login" ? "Register" : "Login"}
        </button>
      </div>
      <SignIn></SignIn>
      <SignOut></SignOut>
    </div>
  );
}
