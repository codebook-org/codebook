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

  export namespace DataTypes {

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

  }

  export namespace Problems {

    export async function getProblems(): Promise<DataTypes.Problem[]> {
      let result = await sql`SELECT json_agg(u) FROM problems u`;
      return result[0]["jsonAgg"];
    }

    export async function getProblemByProblemId(
      problemId: number,
    ): Promise<DataTypes.Problem | null> {
      let result =
        await sql`SELECT * FROM problems WHERE problem_id = ${problemId}`;
      if (result.length > 0) {
        return result[0] as DataTypes.Problem;
      } else {
        return null;
      }
    }

    export async function getProblemsByUserId(userId: number): Promise<DataTypes.Problem[]> {
      let result = await sql`SELECT * FROM problems WHERE user_id = ${userId}`;
      return Array.from(result.values()) as DataTypes.Problem[];
    }

    export async function createProblem(
      data: DataTypes.ProblemData,
    ): Promise<number | null> {
      let result = await sql`
        INSERT INTO problems (title, description, user_id)
        VALUES(${data.title}, ${data.description}, ${data.userId ?? null})
        RETURNING problem_id
      `;
      return result[0]["problemId"];
    }

    export namespace TestCases {

      export async function createTestCase(
        data: DataTypes.TestCaseData,
      ): Promise<Number | null> {
        let result = await sql`
          INSERT INTO testcases (problem_id, input, expected_out, visible)
          VALUES(${data.problemId}, ${data.input}, ${data.expectedOut}, ${data.visible})
          RETURNING testcase_id
        `;
        return result[0]["testcaseId"];
      }

      export async function getTestCasesByProblemId(
        problemId: number,
      ): Promise<DataTypes.TestCase[]> {
        let result =
          await sql`SELECT * FROM testcases WHERE problem_id = ${problemId}`;
        return Array.from(result.values()) as DataTypes.TestCase[];
      }
      
    }

  }

  export namespace Users {
    
    export async function getUserByEmail(email: string): Promise<DataTypes.User | null> {
      let result = await sql`SELECT * FROM users WHERE email = ${email}`;
      if (result.length > 0) {
        return result[0] as DataTypes.User;
      } else {
        return null;
      }
    }

    export async function getUserByGoogleOauthId(
      googleOauthId: string,
    ): Promise<DataTypes.User | null> {
      let result =
        await sql`SELECT * FROM users WHERE google_oauth_id = ${googleOauthId}`;
      if (result.length > 0) {
        return result[0] as DataTypes.User;
      } else {
        return null;
      }
    }

    export async function getUserById(userId: number): Promise<DataTypes.User | null> {
      let result = await sql`SELECT * FROM users WHERE user_id = ${userId}`;
      if (result.length > 0) {
        return result[0] as DataTypes.User;
      } else {
        return null;
      }
    }

    export async function registerUser(
      data: DataTypes.UserCreationInformation,
    ): Promise<number | null> {
      let result = await sql`
        INSERT INTO users (username, email, password_hash, google_oauth_id)
        VALUES(${data.username}, ${data.email ?? null}, ${data.passwordHash ?? null}, ${data.googleOauthId ?? null})
        RETURNING user_id
      `;
      return result[0]["userId"];
    }

  }



  // TODO: Still Stubs
  export async function createSubmission(
    data: DataTypes.SubmissionData,
  ): Promise<DataTypes.SubmissionDataResponse> {
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

  

  // Old Type Exports; Under a Soft Migration to DataTypes child namespace

  /** @deprecated Use CodebookDatabaseAPI.DataTypes.UserCreationInformation instead */
  export type UserCreationInformation = DataTypes.UserCreationInformation;
  /** @deprecated Use CodebookDatabaseAPI.DataTypes.User instead */
  export type User = DataTypes.User;
  /** @deprecated Use CodebookDatabaseAPI.DataTypes.TestCaseData instead */
  export type TestCaseData = DataTypes.TestCaseData;
  /** @deprecated Use CodebookDatabaseAPI.DataTypes.TestCase instead */
  export type TestCase = DataTypes.TestCase;
  /** @deprecated Use CodebookDatabaseAPI.DataTypes.ProblemData instead */
  export type ProblemData = DataTypes.ProblemData;
  /** @deprecated Use CodebookDatabaseAPI.DataTypes.Problem instead */
  export type Problem = DataTypes.Problem;
  /** @deprecated Use CodebookDatabaseAPI.DataTypes.SubmissionData instead */
  export type SubmissionData = DataTypes.SubmissionData;
  /** @deprecated Use CodebookDatabaseAPI.DataTypes.SubmissionDataResponse instead */
  export type SubmissionDataResponse = DataTypes.SubmissionDataResponse;


  // Old API Exports; Under a Soft Migration to their respective child namespaces

  /** @deprecated Use CodebookDatabaseAPI.Problems.getProblems instead. */
  export const getProblems = Problems.getProblems;
  /** @deprecated Use CodebookDatabaseAPI.Problems.getProblemByProblemId instead. */
  export const getProblemById = Problems.getProblemByProblemId;
  /** @deprecated Use CodebookDatabaseAPI.Problems.getProblemsByUserId instead. */
  export const getProblemByUserId = Problems.getProblemsByUserId;
  /** @deprecated Use CodebookDatabaseAPI.Problems.createProblem instead. */
  export const createProblem = Problems.createProblem;

  /** @deprecated Use CodebookDatabaseAPI.Problems.TestCases.createTestCase instead. */
  export const createTestCase = Problems.TestCases.createTestCase;
  /** @deprecated Use CodebookDatabaseAPI.Problems.TestCases.getTestCasesByProblemId instead. */
  export const getTestCasesById = Problems.TestCases.getTestCasesByProblemId;

  /** @deprecated Use CodebookDatabaseAPI.Users.getUserByEmail instead. */
  export const getUserByEmail = Users.getUserByEmail;
  /** @deprecated Use CodebookDatabaseAPI.Users.getUserByGoogleOauthId instead. */
  export const getUserByGoogleOauthId = Users.getUserByGoogleOauthId;
  /** @deprecated Use CodebookDatabaseAPI.Users.getUserById instead. */
  export const getUserById = Users.getUserById;
  /** @deprecated Use CodebookDatabaseAPI.Users.registerUser instead. */
  export const registerUser = Users.registerUser;

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
