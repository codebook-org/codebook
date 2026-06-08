"use server"

import { CodebookDatabaseAPI } from "@/lib/db";

export async function getBio(userId) {
  let data = await CodebookDatabaseAPI.getBio({
    userId: userId,
  });
  return data.bio;
}