import "server-only";

import postgres from "postgres";
import { register } from "node:module";
import { DANGEROUSLY_runPendingImmediatesAfterCurrentTask } from "next/dist/server/node-environment-extensions/fast-set-immediate.external";

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
    email?: string;
    passwordHash?: string;
    googleOauthId?: string;
  };

  export type User = {
    userId: number;
    username: string;
    email: string;
    passwordHash: string;
    displayName?: string;
    googleOauthId?: string;
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

  export async function getProblemById(
    problemId: number,
  ): Promise<Problem | null> {
    let result =
      await sql`SELECT * FROM Problems WHERE problem_id = ${problemId}`;
    if (result.length > 0) {
      return result[0] as Problem;
    } else {
      return null;
    }
  }

  export async function createProblem(
    data: ProblemData,
  ): Promise<number | null> {
    let result = await sql`
      INSERT INTO Problems (title, description, user_id)
      VALUES(${data.title}, ${data.description}, ${data.userId ?? null})
      RETURNING problem_id
    `;
    return result[0]["problemId"];
  }

  // TODO: Still Stubs
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

  export async function createTestCase(
    data: TestCaseData,
  ): Promise<Number | null> {
    let result = await sql`
      INSERT INTO TestCases (problem_id, input, expected_out, visible)
      VALUES(${data.problemId}, ${data.input}, ${data.expectedOut}, ${data.visible})
      RETURNING testcase_id
    `;
    return result[0]["testcaseId"];
  }

  export async function getTestCasesById(
    problemId: number,
  ): Promise<TestCase[]> {
    let result =
      await sql`SELECT * FROM Testcases WHERE problem_id = ${problemId}`;
    return Array.from(result.values()) as TestCase[];
  }

  // Note: currently, email is case sensitive
  export async function getUserByEmail(email: string): Promise<User | null> {
    let result = await sql`SELECT * FROM Users WHERE email = ${email}`;
    if (result.length > 0) {
      return result[0] as User;
    } else {
      return null;
    }
  }

  export async function getUserByGoogleOauthId(
    googleOauthId: string,
  ): Promise<User | null> {
    let result =
      await sql`SELECT * FROM Users WHERE google_oauth_id = ${googleOauthId}`;
    if (result.length > 0) {
      return result[0] as User;
    } else {
      return null;
    }
  }

  export async function getUserById(
    userId: number,
  ): Promise<User | null> {
    let result = await sql`SELECT * FROM Users WHERE user_id = ${userId}`;
    if (result.length > 0) {
      return result[0] as User;
    } else {
      return null;
    }
  }

  export async function getProblemByUserId(
    userId: number,
  ): Promise<Problem[]> {
    let result =
      await sql`SELECT * FROM Problems WHERE user_id = ${userId}`;
    return Array.from(result.values()) as Problem[];
  }

  // Note: currently, there is no check for case sensitivity on usernames or emails
  // Postgres only cares if usernames and emails are unique with case sensitivity
  // In the future, there will be checks and an internal id will be used instead
  export async function registerUser(
    data: UserCreationInformation,
  ): Promise<number | null> {
    let result = await sql`
      INSERT INTO Users (username, email, password_hash, google_oauth_id)
      VALUES(${data.username}, ${data.email ?? null}, ${data.passwordHash ?? null}, ${data.googleOauthId ?? null})
      RETURNING user_id
    `;
    return result[0]["userId"];
  }
}

// if it isn't clear by now, these are DEBUG STUFF FOR THE DATABASE MAN
if (false) {
  // console.log(await CodebookDatabaseAPI.getProblemById(1))
  // console.log(await CodebookDatabaseAPI.createProblem("TestTitle", "testDesc"))
  // console.log(await CodebookDatabaseAPI.getProblems())
  // console.log(await CodebookDatabaseAPI.getUserByEmail("test@test.test"))
  // console.log(await CodebookDatabaseAPI.getUserByGoogleOauth("iamtheadmin"))
  // if (await CodebookDatabaseAPI.getUserByEmail("email@insert.test") == null) {
  //   await CodebookDatabaseAPI.registerUser({username: "emailInsertTest", email: "email@insert.test", passwordHash: "notimportantbro"})
  //   console.log(await CodebookDatabaseAPI.getUserByEmail("email@insert.test"))
  // } else {
  //   console.log(await CodebookDatabaseAPI.getUserByEmail("email@insert.test"))
  // }
  // if (await CodebookDatabaseAPI.getUserByGoogleOauth("insertTest") == null) {
  //   await CodebookDatabaseAPI.registerUser({username: "googleOauthInsertTest", googleOauthId: "insertTest"})
  //   console.log(await CodebookDatabaseAPI.getUserByGoogleOauth("insertTest"))
  // } else {
  //   console.log(await CodebookDatabaseAPI.getUserByGoogleOauth("insertTest"))
  // }
}

export default sql;
