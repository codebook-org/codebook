"use server";
import { CodebookDatabaseAPI } from "@/lib/db";

// Stealing Markos idea of having an actions js. but it doesn't really affect how this works, aha..

export async function addProblem(title, description, userId) {
  let data = await CodebookDatabaseAPI.createProblem({
    title: title,
    description: description,
    userId: userId,
  });
  return data;
}

export async function addTestCasedb(problemId, input, expectedOut, visible) {
  await CodebookDatabaseAPI.createTestCase({
    problemId: problemId,
    input: input,
    expectedOut: expectedOut,
    visible: visible,
  });
}
