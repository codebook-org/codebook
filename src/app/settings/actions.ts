"use server";

import { CodebookDatabaseAPI } from "@/lib/db";

export async function getBio(userId) {
  let data = await CodebookDatabaseAPI.getBio(userId);
  return data.bio;
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
