"use server";

import { auth } from "@/auth";
import { CodebookDatabaseAPI } from "@/lib/db";

export async function addProblem(title, description, starterCode) {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  } else {
    try {
      return await CodebookDatabaseAPI.Problems.createProblem({
        title: title,
        description: description,
        userId: Number(session.user.id),
        starterCode: starterCode,
      });
    } catch (err) {
      console.log("Failed to publish problem.");
      return null;
    }
  }
}

export async function addTestCasedb(problemId, input, expectedOut, visible) {
  const session = await auth();
  const currentUserId = Number(session?.user?.id);

  if (!currentUserId) return null; // unauthorized

  // problem to add test case for
  const problem =
    await CodebookDatabaseAPI.Problems.getProblemByProblemId(problemId);
  if (!problem) return null; // problem not found

  if (problem.userId !== currentUserId) return null; // unauthorized

  await CodebookDatabaseAPI.Problems.TestCases.createTestCase({
    problemId: problemId,
    input: input,
    expectedOut: expectedOut,
    visible: visible,
  });
}
