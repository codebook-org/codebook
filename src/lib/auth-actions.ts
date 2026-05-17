"use server";

import { signIn, signOut } from "@/auth";
import { redirect } from "next/navigation";

export async function handleSignIn() {
  try {
    await signIn("google");
  } catch (error) {
    throw error;
  }
}

export async function handleSignOut() {
  await signOut({ redirect: false });

  redirect("/");
  // Sorry, there's a lot of redirect("/").
  // It's to force reloads when signing out to ensure we drop the profile picture.
}

export async function syncOAuth(oauthId: string, email: string, name: string) {
  // Parse, search by ID.
  // If they exist, update their name if required.
  // If they don't exist, let's add their account.
  // Do they have an existing credentials account?
  // No : Let's create this accoun and push in the oAuthId as their secondary ID.
  // Yes : We can go ahead and add this user to the credentials account.
}
