"use client";

import { signOut } from "next-auth/react";
import Button from "@/components/Button";

export default function SignOut() {
  const handleOnClick = async () => {
    const data = await signOut({ redirect: false, callbackUrl: "/" });

    // Force a reload.
    window.location.href = data.url || "/";
  };

  return <Button type="button" text="Sign Out" onClick={handleOnClick} />;
}
