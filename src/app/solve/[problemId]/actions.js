"use server";
import { CodebookDBHelpers } from "@/lib/db";

export async function saveCode(problemId, code) {
  const submission = await CodebookDBHelpers.createSubmission({
    problemId: problemId,
    code: code,
  });

  return submission.id;
}

export async function getResults(submissionId) {
  return await CodebookDBHelpers.getResultsById(submissionId);
}

export async function runCode(language, code, input) {
  try {
    const response = await fetch("http://localhost:2000/api/v2/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: language,
        version: "*",
        files: [{ content: code }],
        stdin: String(input),
      }),
    });

    const data = await response.json();
    return data.run;
  } catch (error) {
    return { error: "Piston is unreachable" };
  }
}
