"use server";
import { CodebookDatabaseAPI } from "@/lib/db";

// Stealing Markos idea of having an actions js. but it doesn't really affect how this works, aha..

export async function addProblem(title, description) {
  await CodebookDatabaseAPI.createProblem({
    title: title,
    description: description,
  });
}
