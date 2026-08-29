"use server";
import { CodebookDatabaseAPI } from "@/lib/db";

export async function addProblem(title, description, userId, starterCode) {
  let data = await CodebookDatabaseAPI.Problems.createProblem({
    title: title,
    description: description,
    userId: userId,
    starterCode: starterCode,
  });
  return data;
}

export async function addTestCasedb(problemId, input, expectedOut, visible) {
  await CodebookDatabaseAPI.Problems.TestCases.createTestCase({
    problemId: problemId,
    input: input,
    expectedOut: expectedOut,
    visible: visible,
  });
}
