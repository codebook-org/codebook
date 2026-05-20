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
  // For now, since we don't have a syncing feature (aka, tying a oAuth to a credential), let's just create an account, how about that?
  let user = await CodebookDatabaseAPI.getUserByGoogleOauthId(oauthId);

  if (user) {
    // If they exist, return their actual integer userId
    return user.userId;
  } else {
    // If they don't exist, register them and capture the new userId returned by Postgres
    const newUserId = await CodebookDatabaseAPI.registerUser({
      username: email.split("@")[0],
      email: email, // Highly recommended to save their email here too!
      googleOauthId: oauthId,
    });

    // Fallback if registerUser somehow returns null, though it shouldn't
    if (!newUserId) {
      throw new Error("Failed to register OAuth user in database.");
    }

    return newUserId;
  }
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

  // Else, we...

  // Create a new user,
  const newUser = {
    userId: fakeUsers.length + 1,
    email: email,
    passwordHash: password,
    username: email.split("@")[0],
  };

  // Then we register them.
  CodebookDatabaseAPI.registerUser({
    username: newUser.username,
    email: newUser.email,
    passwordHash: newUser.passwordHash,
  });

  console.log("User registered on server:", newUser);

  // NWe can log in the newly registered user.
  return await credentialLogIn(email, password);
}
