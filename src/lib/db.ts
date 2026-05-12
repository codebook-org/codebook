import "server-only";

import postgres from "postgres";

const sql = postgres({
  host: "localhost:",
  port: Number(process.env.LOCAL_POSTGRES_PORT),
  user: process.env.LOCAL_POSTGRES_USER,
  password: process.env.LOCAL_POSTGRES_PASSWORD,
  database: process.env.LOCAL_POSTGRES_DB,
});

export namespace CodebookDatabaseAPI {
  // export type UserCreationInformation = {
  //   username: string,
  //   email?: string,
  //   password_hash: string,
  //   display_name?: string,
  //   bio?: string,
  // }
  // export type User = {
  //   user_id: number,
  //   username: string,
  //   email?: string,
  //   password_hash: string,
  //   created_at: TIMESTAMP NOT NULL,
  //   display_name?: string,
  //   bio?: string,
  //   creation_ids?: number[]
  // }

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
    return result[0]["json_agg"];
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
}

// console.log(await CodebookDatabaseAPI.getProblemById(1))
// console.log(await CodebookDatabaseAPI.createProblem("TestTitle", "testDesc"))
// console.log(await CodebookDatabaseAPI.getProblems())

export default sql;
