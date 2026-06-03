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
  const pistonHost = process.env.PISTON_URL || "http://localhost:2000";

  let passed = 0;
  let hiddenPassed = 0;
  let totalTests = 0;
  let totalHidden = 0;
  let results = [];

  // isolate first test case to check for compile error
  const firstTest = testcases[0];
  const firstResponse = await fetch(`${pistonHost}/api/v2/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language: language,
      version: "*",
      files: [{ content: code }],
      stdin: String(firstTest.input),
    }),
  });

  const firstData = await firstResponse.json();

  // check for compile error
  if (firstData.compile?.code && firstData.compile.code !== 0) {
    return {
      code: 1,
      verdict: "Compile Error",
      stderr: firstData.compile.stderr,
    };
  }

  // process remaining test cases
  for (let i = 0; i < testcases.length; i++) {
    const test = testcases[i];
    let data;

    // use data from the first test
    if (i === 0) {
      data = firstData;
    } else {
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

      data = await response.json();
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
