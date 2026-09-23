"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { CodebookDatabaseAPI } from "@/lib/db";

export async function deleteProblemAction(problemId) {
  const session = await auth();
  const currentUserId = Number(session?.user?.id);

  if (!currentUserId) return { success: false }; // unauthorized

  try {
    const problem =
      await CodebookDatabaseAPI.Problems.getProblemByProblemId(problemId);
    if (!problem) return { success: false }; // problem not found

    if (problem.userId !== currentUserId) {
      // unauthorized
      return { success: false };
    }

    await CodebookDatabaseAPI.Problems.deleteProblemByProblemId(problemId);
    revalidatePath("/problems");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
