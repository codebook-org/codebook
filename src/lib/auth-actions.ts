"use server";

import { signIn, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { fakeUsers } from "@/lib/data";

import { revalidatePath } from "next/cache";

import { CodebookDatabaseAPI } from "@/lib/db";

// OAuth Functions
export async function handleSignIn() {
  try {
    await signIn("google", { redirectTo: "/" });
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
    return user;
  } else {
    // If they don't exist, register them and capture the new userId returned by Postgres
    const newUserId = await CodebookDatabaseAPI.registerUser({
      username: email.split("@")[0],
      displayName: name,
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
  // We should let the database tell us what we should push in. Not sure why I made the function do it.
  try {
    const pulledUser = await CodebookDatabaseAPI.getUserByEmail(email);

    if (!pulledUser) {
      return { error: "Invalid credentials." };
    }

    await signIn("credentials", {
      email: email,
      password: password,
      displayName: pulledUser.displayName,
      username: pulledUser.username,
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

export async function registerAndLogin(
  email: string,
  password: string,
  displayName: string,
  username: string,
) {
  const existingUser = await CodebookDatabaseAPI.getUserByEmail(email);

  if (existingUser) {
    // Let's be safer here.
    if (existingUser.passwordHash != password) {
      return { error: "EMAIL_TAKEN" };
    } else {
      return await credentialLogIn(email, password);
    }
  }

  // Else, we...
  try {
    // Then we register them. The password is not yet hashed correctly.
    let newUser = await CodebookDatabaseAPI.registerUser({
      username: username ?? email.split("@")[0],
      displayName: displayName ?? "",
      email: email,
      passwordHash: password,
    });

    console.log("User registered on server");

    // NWe can log in the newly registered user.
    return await credentialLogIn(email, password);
  } catch (error: any) {
    if (error.message?.includes("users_username_key")) {
      // If a duped user is put in, it will catch and return an error for us.
      return { error: "USERNAME_TAKEN" };
    }

    // Something else..? :Shy:
    return { error: "Something fatal occured during registration." };
  }
}
