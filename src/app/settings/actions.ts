"use server";

import { CodebookDatabaseAPI } from "@/lib/db";

export async function getUserProfile(userId) {
  let data = await CodebookDatabaseAPI.getUserById(userId);
  return data;
}

export async function changeSettings(userId, username, displayName, bio) {
  try {
    return await CodebookDatabaseAPI.changeInfo(
      userId,
      username,
      displayName,
      bio,
    );
  } catch (err) {
    return null;
  }
}
