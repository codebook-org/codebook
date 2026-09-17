"use server";

import { auth } from "@/auth";
import { CodebookDatabaseAPI } from "@/lib/db";

export async function getUserProfile(userId) {
  let data = await CodebookDatabaseAPI.getUserById(userId);
  return data;
}

export async function changeSettings(username, displayName, bio) {
  const session = await auth(); // Resolve session on our server side.

  if (!session?.user?.id) {
    // If our user doesnt exist, return null.
    return null;
  } else {
    try {
      return await CodebookDatabaseAPI.changeInfo(
        session.user.id,
        username,
        displayName,
        bio,
      );
    } catch (err) {
      console.log("Failed to change settings.");
      return null;
    }
  }
}
