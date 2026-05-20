"use server";
import { CodebookDatabaseAPI } from "@/lib/db";

export async function saveCode(problemId, code) {
  const submission = await CodebookDatabaseAPI.createSubmission({
    problemId: problemId,
    code: code,
  });

  return submission.id;
}

export async function getResults(submissionId) {
  return await CodebookDatabaseAPI.getResultsById(submissionId);
}

export async function runCode(problemId, language, code) {
  const testcases = await CodebookDatabaseAPI.getTestCasesById(problemId);

  let passed = 0;
  let results = [];
  let totalTests = 0;

  for (const test of testcases) {
    const pistonHost = process.env.PISTON_URL || "http://localhost:2000";
    const response = await fetch(`${pistonHost}/api/v2/execute`, {
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

    totalTests++;

    // If this test case should be visible, then display it.
    if (test.visible === true) {
      results.push({
        passed: String(test.expectedOut) === actualOut,
        input: test.input,
        expectedOut: test.expectedOut,
        actualOut: actualOut,
      });
    }
  }

  return {
    verdict: passed === testcases.length ? "Accepted" : "Wrong Answer",
    passedCount: passed,
    totalTests: totalTests,
    results: results,
  };
}
