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
  let hiddenPassed = 0;
  let totalTests = 0;
  let totalHidden = 0;
  let results = [];

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

    // check for compile error
    if (data.compile?.code && data.compile.code !== 0) {
      return {
        code: 1,
        verdict: "Compile Error",
        stderr: data.compile.stderr,
      };
    }

    // check for runtime error
    if (data.run?.code && data.run.code !== 0) {
      return {
        code: 1,
        verdict: "Runtime Error",
        stderr: data.run.stderr,
      };
    }

    const actualOut = data.run.stdout.trim();

    if (String(test.expectedOut) === actualOut) {
      passed++;
    }

    totalTests++;

    if (test.visible) {
      results.push({
        passed: String(test.expectedOut) === actualOut,
        input: test.input,
        expectedOut: test.expectedOut,
        actualOut: actualOut,
      });
    } else {
      if (String(test.expectedOut) === actualOut) hiddenPassed++;
      totalHidden++;
    }
  }

  return {
    code: 0,
    verdict: passed === testcases.length ? "Accepted" : "Wrong Answer",
    passedCount: passed,
    totalTests: totalTests,
    hiddenPassedCount: hiddenPassed,
    totalHiddenTests: totalHidden,
    results: results,
  };
}
