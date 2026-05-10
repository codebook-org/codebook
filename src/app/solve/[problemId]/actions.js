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

export async function runCode(problemId, language, code) {
  const testcases = await CodebookDBHelpers.getTestcasesById(problemId);

  let passed = 0;
  let results = [];

  for (const test of testcases) {
    const response = await fetch("http://localhost:2000/api/v2/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: language,
        version: "*",
        files: [{ content: code }],
        stdin: String(test.input),
      }),
    });

    const data = await response.json();
    const actualOut = data.run.stdout.trim();

    if (String(test.expectedOut) === actualOut) {
      passed++;
    }

    results.push({
      passed: String(test.expectedOut) === actualOut,
      input: test.input,
      expectedOut: test.expectedOut,
      actualOut: actualOut,
    });
  }

  return {
    verdict: passed === testcases.length ? "Accepted" : "Wrong Answer",
    results: results,
  };
}
