"use server";

import { signIn, signOut } from "@/auth";

export async function handleSignIn() {
  try {
    await signIn("google");
  } catch (error) {
    throw error;
  }
}

export async function handleSignOut() {
  await signOut();
}
