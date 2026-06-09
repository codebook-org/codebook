"use server";
import { CodebookDatabaseAPI } from "@/lib/db";
import { auth } from "@/auth";

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

  // helper function to fetch a Piston execution
  const executeWithPiston = async (test) => {
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

    return response.json();
  };

  // isolate first test case to check for compile error
  const firstTest = testcases[0];
  const firstData = await executeWithPiston(firstTest);

  // check for compile error
  if (firstData.compile?.code && firstData.compile.code !== 0) {
    return {
      code: 1,
      verdict: "Compile Error",
      stderr: firstData.compile.stderr,
    };
  }

  let passed = 0;
  let hiddenPassed = 0;
  let totalTests = 0;
  let totalHidden = 0;
  let results = [];

  // process remaining test cases
  for (let i = 0; i < testcases.length; i++) {
    const test = testcases[i];
    let data;

    // use data from the first test
    if (i === 0) {
      data = firstData;
    } else {
      data = await executeWithPiston(test);
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

export async function submitVoteAction(problemId, vote) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "You must be logged in to vote!" };
  }

  console.log("--- VOTE DEBUGGER ---");
  console.log("Session exists?", !!session);
  console.log("User object:", session?.user);
  console.log("Problem ID received:", problemId);
  console.log("Vote received:", vote);
  console.log("---------------------");

  await CodebookDatabaseAPI.Problems.Votes.updateUserProblemVote(
    session.user.id,
    problemId,
    vote,
  );

  return { success: true };
}
