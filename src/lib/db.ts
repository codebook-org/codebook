import "server-only";

import postgres from "postgres";

const sql = postgres({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.LOCAL_POSTGRES_PORT),
  user: process.env.LOCAL_POSTGRES_USER,
  password: process.env.LOCAL_POSTGRES_PASSWORD,
  database: process.env.LOCAL_POSTGRES_DB,
  transform: postgres.toCamel,
});

export namespace CodebookDatabaseAPI {
  // Isabelle here, I uncommented and changed some minor stuff.
  export type UserCreationInformation = {
    username: string;
    email: string;
    passwordHash: string;
  };

  export type User = {
    userId: number;
    username: string;
    email: string;
    passwordHash: string;
    displayName?: string;
    oAuthId?: string;
    bio?: string;
  };

  export type TestCaseData = {
    problemId: number;
    input: string;
    expectedOut: string;
    visible: boolean;
  };
  export type TestCase = TestCaseData & { testcaseId: number };

  export type ProblemData = {
    title: string;
    description: string;
    userId?: number;
  };
  export type Problem = ProblemData & { problemId: number };

  export type SubmissionData = {
    problemId: number;
    code: string;
  };
  export type SubmissionDataResponse = SubmissionData & { id: number };

  export async function getProblems(): Promise<Problem[]> {
    let result = await sql`SELECT json_agg(u) FROM Problems u`;
    return result[0]["jsonAgg"];
  }

  export async function getProblemById(problemId: number): Promise<Problem> {
    let result =
      await sql`SELECT * FROM Problems WHERE problem_id = ${problemId}`;
    if (result.length > 0) {
      return result[0] as Problem;
    } else {
      return null;
    }
  }

  export async function createProblem(data: ProblemData) {
    let result = await sql`
      INSERT INTO Problems (title, description, user_id)
      VALUES(${data.title}, ${data.description}, ${data.userId ?? null})
    `;
    console.log(result);
  }

  export async function createSubmission(
    data: SubmissionData,
  ): Promise<SubmissionDataResponse> {
    // data is a js object like {problemId: problemId, code: code}
    // this function should return the created record
    // placeholder return so that my code works for now
    return {
      id: 1,
      problemId: data.problemId,
      code: data.code,
    };
  }

  export async function getResultsById(submissionId) {
    return {
      id: submissionId,
      verdict: "Accepted",
    };
  }

  export async function createTestCase(data: TestCaseData) {
    let result = await sql`
      INSERT INTO TestCases (problem_id, input, expected_out, visible)
      VALUES(${data.problemId}, ${data.input}, ${data.expectedOut}, ${data.visible})
    `;
    console.log(result);
  }

  export async function getTestCasesById(
    problemId: number,
  ): Promise<TestCase[]> {
    let result =
      await sql`SELECT * FROM Testcases WHERE problem_id = ${problemId}`;
    return Array.from(result.values()) as TestCase[];
  }

  // Stubs for login. Uh... I don't know if this is right?
  export async function getUserByEmail(email: string): Promise<User | null> {
    // For now, I have some ugly ass stubs. Bear with me here.
    if (email === "bobjoe@gmail.com") {
      return {
        userId: 2,
        username: "bobjoe",
        email: "bobjoe@gmail.com",
        passwordHash: "12345", // For now, we're plaintexting it. I KNOW, ITS UNSAFE :(
        displayName: "evil bob joe",
      };
    } else if (email === "hitman@gmail.com") {
      return {
        userId: 3,
        username: "hitman",
        email: "hitman@gmail.com",
        passwordHash: "hitmen", // Gosh, I love being unsafe.
        // This example does not have a display name.
      };
    }

    // Looks for an email, returns the most vital information for display.

    return null;
  }

  export async function registerUser(data: UserCreationInformation) {
    // No need to check if they already exist; we already check if they exist beforehand, so its implied that we're a new guy.

    // All we need to do is to add all the information. :)
    return null;
  }
}

// console.log(await CodebookDatabaseAPI.getProblemById(1))
// console.log(await CodebookDatabaseAPI.createProblem("TestTitle", "testDesc"))
// console.log(await CodebookDatabaseAPI.getProblems())

export default sql;
