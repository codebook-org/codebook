"use client";

import SignIn from "@/components/logincomponents/SignIn";
import SignOut from "@/components/logincomponents/SignOut";
import ProfilePicture from "@/components/logincomponents/ProfilePicture";

import { SessionProvider } from "next-auth/react";

export default function AuthManager() {
  return (
    <SessionProvider>
      <SignIn></SignIn>
      <SignOut></SignOut>
      <ProfilePicture></ProfilePicture>
    </SessionProvider>
  );
}
