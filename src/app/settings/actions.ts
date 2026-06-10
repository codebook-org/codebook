"use server";

import { CodebookDatabaseAPI } from "@/lib/db";

export async function getUserProfile(userId) {
  let data = await CodebookDatabaseAPI.getUserById(userId);
  return data;
}

export async function changeSettings(userId, username, displayName, bio) {
  let data = await CodebookDatabaseAPI.changeInfo(
    userId,
    username,
    displayName,
    bio,
  );

  return data;
}
