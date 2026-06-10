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

/**
 * Namespace containing all prebuilt APIs and Data Types for the Codebook Database
 */
export namespace CodebookDatabaseAPI {
  /**
   * All Data Types used in the Codebook Database APIs
   */
  export namespace DataTypes {
    export type UserCreationInformation = {
      username: string;
      email?: string;
      passwordHash?: string;
      googleOauthId?: string;
      displayName?: string;
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

    export type TestCaseCreationData = {
      problemId: number;
      input: string;
      expectedOut: string;
      visible: boolean;
    };
    export type TestCase = TestCaseCreationData & { testcaseId: number };

    export type ProblemCreationData = {
      title: string;
      description: string;
      userId?: number;
    };
    export type Problem = ProblemCreationData & {
      problemId: number;
      likeCount: number;
      dislikeCount: number;
    };

    export type SubmissionData = {
      problemId: number;
      code: string;
    };
    export type SubmissionDataResponse = SubmissionData & { id: number };
  }

  /**
   * All Problem APIs
   * Includes Votes, User Solves, and TestCase APIs as child namespaces
   */
  export namespace Problems {
    /**
     * Gets all problems currently in the database
     *
     * @returns All problems in the database
     */
    export async function getProblems(): Promise<DataTypes.Problem[]> {
      const result = await sql`SELECT json_agg(u) FROM problems u`;

      return result[0]["jsonAgg"];
    }

    /**
     * Gets the problem data from a problem ID
     *
     * @param problemId - The ID of the problem to get the data of
     *
     * @returns The problem data of the given problem ID
     */
    export async function getProblemByProblemId(
      problemId: number,
    ): Promise<DataTypes.Problem | null> {
      const result =
        await sql`SELECT * FROM problems WHERE problem_id = ${problemId}`;

      return result.length > 0 ? (result[0] as DataTypes.Problem) : null;
    }

    /**
     * Gets the problems created by a given user
     *
     * @param userId - The ID of the user to get the problems from
     *
     * @returns An array of the problems the given user has created
     */
    export async function getProblemsByUserId(
      userId: number,
    ): Promise<DataTypes.Problem[]> {
      const result =
        await sql`SELECT * FROM problems WHERE user_id = ${userId}`;

      return Array.from(result.values()) as DataTypes.Problem[];
    }

    /**
     * Creates a problem
     *
     * @param problemCreationData - The data of the problem being published
     *
     * @returns The ID of the new problem in the database
     */
    export async function createProblem(
      problemCreationData: DataTypes.ProblemCreationData,
    ): Promise<number | null> {
      const result = await sql`
        INSERT INTO problems (title, description, user_id)
        VALUES(${problemCreationData.title}, ${problemCreationData.description}, ${problemCreationData.userId ?? null})
        RETURNING problem_id
      `;

      return result[0]["problemId"];
    }

    /**
     * All Problem Vote APIs
     */
    export namespace Votes {
      /**
       * Returns if the given user likes/dislikes the given problem
       *
       * @param userId - The ID of the user to check the vote of
       * @param problemId - The ID of the problem to check the vote of
       *
       * @returns True/False if the user's vote was changed or not. Null if they haven't voted.
       */
      export async function getUserProblemVote(
        userId: number,
        problemId: number,
      ): Promise<boolean | null> {
        const result = await sql`
          SELECT is_like
          FROM problem_votes
          WHERE user_id = ${userId} AND problem_id = ${problemId};
        `;

        return result.length > 0 ? result[0].is_like : null;
      }

      /**
       * Updates the given problem like/dislike counters with the given user ID
       *
       * @param userId - The ID of the user voting on the problem
       * @param problemId - The ID of the problem the user is voting on
       * @param isLike - True/False representing if the user liked or disliked the problem respectively, null if deleting vote
       *
       * @returns True/False if the user's vote was changed or not.
       */
      export async function updateUserProblemVote(
        userId: number,
        problemId: number,
        isLike?: boolean,
      ): Promise<boolean> {
        if (isLike != null) {
          const result = await sql`
            INSERT INTO problem_votes (user_id, problem_id, is_like)
            SELECT ${userId}, ${problemId}, ${isLike}
            WHERE NOT EXISTS (
              SELECT 1
              FROM problem_votes
              WHERE user_id = ${userId}
                AND problem_id = ${problemId}
                AND is_like = ${isLike}  -- skip if identical
            )
            ON CONFLICT (user_id, problem_id)
            DO UPDATE
              SET is_like = EXCLUDED.is_like
              WHERE problem_votes.is_like IS DISTINCT FROM EXCLUDED.is_like
            RETURNING 1;
          `;

          return result.length > 0;
        } else {
          const result = await sql`
            DELETE FROM problem_votes
            WHERE user_id = ${userId} AND problem_id = ${problemId}
            RETURNING 1;
          `;

          return result.length > 0;
        }
      }

      /**
       * Gets all problems a user has voted on
       *
       * @param userId - The ID of the user to get the votes from
       *
       * @returns An array of problem IDs & if the user liked the problem or not.
       */
      export async function getProblemsVotedOnByUser(
        userId: number,
      ): Promise<{ problemId: number; isLike: boolean }[]> {
        const result = await sql`
          SELECT problem_id, is_like
          FROM problem_votes
          WHERE user_id = ${userId};
        `;

        return Array.from(result.values()) as {
          problemId: number;
          isLike: boolean;
        }[];
      }

      /**
       * Gets all users who've voted on a problem
       *
       * @param problemId - The ID of the problem to get the users from
       *
       * @returns An array of user IDs & if the user liked the problem or not.
       */
      export async function getUsersVotedOnProblem(
        problemId: number,
      ): Promise<{ userId: number; isLike: boolean }[]> {
        const result = await sql`
          SELECT user_id, is_like
          FROM problem_votes
          WHERE problem_id = ${problemId};
        `;

        return Array.from(result.values()) as {
          userId: number;
          isLike: boolean;
        }[];
      }
    }

    /**
     * All User Solve APIs
     */
    export namespace UserSolves {
      /**
       * Returns if the given user has solved the given problem
       *
       * @param userId - The ID of the user to check
       * @param problemId - The ID of the problem to check
       *
       * @returns A JavaScript Object with the timestamp of when the user solved the problem, null if they haven't.
       */
      export async function getUserSolvedProblem(
        userId: number,
        problemId: number,
      ): Promise<Date | null> {
        const result = await sql`
          SELECT solved_at
          FROM user_solved_problems
          WHERE user_id = ${userId} AND problem_id = ${problemId};
        `;

        return result.length > 0 ? result[0].solvedAt : null;
      }

      /**
       * Updates the user's solved problems with the given problem
       *
       * @param userId - The ID of the user
       * @param problemId - The ID of the problem
       * @param solved - True/False representing if the user has solved the problem
       *
       * @returns True/False if the given user was added/removed from the user's solved problems.
       */
      export async function updateUserSolvedProblem(
        userId: number,
        problemId: number,
        solved: boolean,
      ): Promise<boolean> {
        if (solved) {
          const result = await sql`
            INSERT INTO user_solved_problems (user_id, problem_id)
            SELECT ${userId}, ${problemId}
            WHERE NOT EXISTS (
              SELECT 1
              FROM user_solved_problems
              WHERE user_id = ${userId}
                AND problem_id = ${problemId}
            )
            RETURNING 1;
          `;

          return result.length > 0;
        } else {
          const result = await sql`
            DELETE FROM user_solved_problems
            WHERE user_id = ${userId} AND problem_id = ${problemId}
            RETURNING 1;
          `;

          return result.length > 0;
        }
      }

      /**
       * Gets all problems a user has solved
       *
       * @param userId - The ID of the user to get the solved problems from
       *
       * @returns An array of problem IDs the user has solved, and a JavaScript Date Object with the timestamp of when.
       */
      export async function getProblemsSolvedByUser(
        userId: number,
      ): Promise<{ problemId: number; solvedAt: Date }[]> {
        const result = await sql`
          SELECT problem_id, solved_at
          FROM user_solved_problems
          WHERE user_id = ${userId};
        `;

        return Array.from(result.values()) as {
          problemId: number;
          solvedAt: Date;
        }[];
      }

      /**
       * Gets all users who've solved a problem
       *
       * @param problemId - The ID of the problem to get the users from
       *
       * @returns An array of user IDs who solved the problem, and a JavaScript Date Object with the timestamp of when.
       */
      export async function getUsersSolvedProblem(
        problemId: number,
      ): Promise<{ userId: number; solvedAt: Date }[]> {
        const result = await sql`
          SELECT user_id, solved_at
          FROM user_solved_problems
          WHERE problem_id = ${problemId};
        `;

        return Array.from(result.values()) as {
          userId: number;
          solvedAt: Date;
        }[];
      }
    }

    /**
     * All TestCase APIs
     */
    export namespace TestCases {
      /**
       * Creates a test case
       *
       * @param testCaseCreationData - The data of the test case being created
       *
       * @returns The ID of the new testcase in the database
       */
      export async function createTestCase(
        testCaseCreationData: DataTypes.TestCaseCreationData,
      ): Promise<number | null> {
        const result = await sql`
          INSERT INTO testcases (problem_id, input, expected_out, visible)
          VALUES(${testCaseCreationData.problemId}, ${testCaseCreationData.input}, ${testCaseCreationData.expectedOut}, ${testCaseCreationData.visible})
          RETURNING testcase_id
        `;

        return result[0]["testcaseId"];
      }

      /**
       * Gets the test cases of a problem
       *
       * @param problemId - The ID of the problem to get the testcases from
       *
       * @returns An array of the testcases the problem has
       */
      export async function getTestCasesByProblemId(
        problemId: number,
      ): Promise<DataTypes.TestCase[]> {
        const result =
          await sql`SELECT * FROM testcases WHERE problem_id = ${problemId}`;

        return Array.from(result.values()) as DataTypes.TestCase[];
      }
    }
  }

  /**
   * All User APIs
   */
  export namespace Users {
    /**
     * Gets the user data from a given email
     *
     * @param email - The case-insensitive email of the user to get the data of
     *
     * @returns The data of the user found, null if no user was found
     */
    export async function getUserByEmail(
      email: string,
    ): Promise<DataTypes.User | null> {
      const result = await sql`SELECT * FROM users WHERE email = ${email}`;

      return result.length > 0 ? (result[0] as DataTypes.User) : null;
    }

    /**
     * Gets the user data from a given Google Oauth id
     *
     * @param googleOauthId - The Google Oauth id of the user to get the data from
     *
     * @returns The data of the user found, null if no user was found
     */
    export async function getUserByGoogleOauthId(
      googleOauthId: string,
    ): Promise<DataTypes.User | null> {
      const result =
        await sql`SELECT * FROM users WHERE google_oauth_id = ${googleOauthId}`;

      return result.length > 0 ? (result[0] as DataTypes.User) : null;
    }

    /**
     * Gets the user data from a given user id
     *
     * @param userId - The ID of the user to get the data from
     *
     * @returns The data of the user found, null if no user was found
     */
    export async function getUserById(
      userId: number,
    ): Promise<DataTypes.User | null> {
      const result = await sql`SELECT * FROM users WHERE user_id = ${userId}`;

      return result.length > 0 ? (result[0] as DataTypes.User) : null;
    }

    /**
     * Registers a new user in the database
     *
     * @param userCreationData - The data to create the new user account with
     *
     * @returns The user ID of the new user in the database
     */
    export async function registerUser(
      userCreationData: DataTypes.UserCreationInformation,
    ): Promise<DataTypes.User | null> {
      const result = await sql`
        INSERT INTO users (username, email, password_hash, google_oauth_id, display_name, bio)
        VALUES(${userCreationData.username}, ${userCreationData.email ?? null}, ${userCreationData.passwordHash ?? null}, ${userCreationData.googleOauthId ?? null}, ${userCreationData.displayName ?? null}, ${"I'm new to codebook! Say hi!"})
        RETURNING *
      `;

      return result.length > 0 ? (result[0] as DataTypes.User) : null;
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

  export async function changeInfo(
    userId: string, 
    username: string, 
    displayName: string,
    bio: string
  ) {}

  // Old Type Exports; Under a Soft Migration to DataTypes child namespace

  /** @deprecated Use CodebookDatabaseAPI.DataTypes.UserCreationInformation instead */
  export type UserCreationInformation = DataTypes.UserCreationInformation;
  /** @deprecated Use CodebookDatabaseAPI.DataTypes.User instead */
  export type User = DataTypes.User;
  /** @deprecated Use CodebookDatabaseAPI.DataTypes.TestCaseCreationData instead */
  export type TestCaseData = DataTypes.TestCaseCreationData;
  /** @deprecated Use CodebookDatabaseAPI.DataTypes.TestCase instead */
  export type TestCase = DataTypes.TestCase;
  /** @deprecated Use CodebookDatabaseAPI.DataTypes.ProblemCreationData instead */
  export type ProblemData = DataTypes.ProblemCreationData;
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
  // OLD TESTS
  // if (false) {
  //   console.log(await CodebookDatabaseAPI.getProblemById(1))
  //   console.log(await CodebookDatabaseAPI.createProblem("TestTitle", "testDesc"))
  //   console.log(await CodebookDatabaseAPI.getProblems())
  //   console.log(await CodebookDatabaseAPI.getUserByEmail("test@test.test"))
  //   console.log(await CodebookDatabaseAPI.getUserByGoogleOauth("iamtheadmin"))
  //   if (await CodebookDatabaseAPI.getUserByEmail("email@insert.test") == null) {
  //     await CodebookDatabaseAPI.registerUser({username: "emailInsertTest", email: "email@insert.test", passwordHash: "notimportantbro"})
  //     console.log(await CodebookDatabaseAPI.getUserByEmail("email@insert.test"))
  //   } else {
  //     console.log(await CodebookDatabaseAPI.getUserByEmail("email@insert.test"))
  //   }
  //   if (await CodebookDatabaseAPI.getUserByGoogleOauth("insertTest") == null) {
  //     await CodebookDatabaseAPI.registerUser({username: "googleOauthInsertTest", googleOauthId: "insertTest"})
  //     console.log(await CodebookDatabaseAPI.getUserByGoogleOauth("insertTest"))
  //   } else {
  //     console.log(await CodebookDatabaseAPI.getUserByGoogleOauth("insertTest"))
  //   }
  // }
  // Problem Votes
  if (false) {
    const debugUpdate = async function (
      userId: number,
      problemId: number,
      val?: boolean,
    ) {
      console.log(`\nUpdating (${userId}, ${problemId}) with value (${val}):`);
      console.log(
        `Vote status changed? ${await CodebookDatabaseAPI.Problems.Votes.updateUserProblemVote(userId, problemId, val)}`,
      );

      const problemDetails =
        await CodebookDatabaseAPI.Problems.getProblemByProblemId(problemId);
      console.log(
        `Problem likes: ${problemDetails.likeCount}, dislikes: ${problemDetails.dislikeCount}`,
      );

      const userVotes =
        await CodebookDatabaseAPI.Problems.Votes.getProblemsVotedOnByUser(
          userId,
        );
      console.log("User Votes:");
      console.log(userVotes);

      const problemVotes =
        await CodebookDatabaseAPI.Problems.Votes.getUsersVotedOnProblem(
          problemId,
        );
      console.log("Problem Votes:");
      console.log(problemVotes);
    };

    // Test single vote, single problem
    await debugUpdate(1, 1, true);
    await debugUpdate(1, 1, true);
    await debugUpdate(1, 1, false);
    await debugUpdate(1, 1, null);

    // Test multiple users, multiple problems
    await debugUpdate(1, 1, true);
    await debugUpdate(1, 2, true);
    await debugUpdate(2, 1, false);
    await debugUpdate(1, 1, true);

    // Erase debug votes
    await debugUpdate(1, 1, null);
    await debugUpdate(1, 2, null);
    await debugUpdate(2, 1, null);

    console.log("");
  }
  // Solved Problems
  if (false) {
    const debugUpdate = async function (
      userId: number,
      problemId: number,
      solved: boolean,
    ) {
      console.log(
        `\nUpdating (${userId}, ${problemId}) with value (${solved}):`,
      );
      console.log(
        `Solve status changed? ${await CodebookDatabaseAPI.Problems.UserSolves.updateUserSolvedProblem(userId, problemId, solved)}`,
      );
      console.log(
        `Solve status: ${await CodebookDatabaseAPI.Problems.UserSolves.getUserSolvedProblem(userId, problemId)}`,
      );

      const userSolves =
        await CodebookDatabaseAPI.Problems.UserSolves.getProblemsSolvedByUser(
          userId,
        );
      console.log("User Solutions:");
      console.log(userSolves);

      const problemSolutions =
        await CodebookDatabaseAPI.Problems.UserSolves.getUsersSolvedProblem(
          problemId,
        );
      console.log("Problem Solutions:");
      console.log(problemSolutions);
    };

    // Test single solve, single problem
    await debugUpdate(1, 1, true);
    await debugUpdate(1, 1, true);
    await debugUpdate(1, 1, false);
    await debugUpdate(1, 1, null);

    // Test multiple users, multiple problems
    await debugUpdate(1, 1, true);
    await debugUpdate(1, 2, true);
    await debugUpdate(2, 1, true);
    await debugUpdate(1, 1, true);

    // Erase debug solves
    await debugUpdate(1, 1, false);
    await debugUpdate(1, 2, false);
    await debugUpdate(2, 1, false);

    console.log("");
  }
}

export default sql;
