"use server";

import { signIn, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { fakeUsers } from "@/lib/data";

import { revalidatePath } from "next/cache";

import { CodebookDatabaseAPI } from "@/lib/db";

// OAuth Functions
export async function handleSignIn() {
  try {
    await signIn("google");
    redirect("/");
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
  // Parse, search by OAuthID.
  // If they exist, update their name if required.
  // If they don't exist, let's add their account.
  // Do they have an existing credentials account?
  // No : Let's create this account and push in the oAuthId as their secondary ID.
  // Yes : We can go ahead and add this user to the credentials account.
}

export async function oldUserByEmail(email: string) {
  return fakeUsers.find((user) => user.email == email);
}

export async function credentialLogIn(email: string, password: string) {
  try {
    await signIn("credentials", {
      email: email,
      password: password,
      redirect: false, // We handle the redirect on the client
    });

    return { success: true };
  } catch (error: any) {
    // Redirects are considered errors. We want to redirect, so no worries on this end.
    if (error.message?.includes("NEXT_REDIRECT")) {
      return { success: true };
    }

    console.error("Auth Error:", error.message);
    return { error: "Invalid credentials." };
  }
}

export async function registerAndLogin(email: string, password: string) {
  const existingUser = await CodebookDatabaseAPI.getUserByEmail(email);

  if (existingUser) {
    // Do we already exist? Then we can just log in.
    return await credentialLogIn(email, password);
  }

  // For now, I'm not quite sure how we want to do our thing, so temporarily we'll still store the registering.
  const newUser = {
    userId: fakeUsers.length + 1,
    email: email,
    passwordHash: password,
    username: email.split("@")[0],
  };

  fakeUsers.push(newUser); // Temporary so that we can use it.

  // Once we get this..
  CodebookDatabaseAPI.registerUser({
    username: newUser.username,
    email: newUser.email,
    passwordHash: newUser.passwordHash,
  });

  console.log("User registered on server:", newUser);

  // NWe can log in the newly registered user.
  return await credentialLogIn(email, password);
}
