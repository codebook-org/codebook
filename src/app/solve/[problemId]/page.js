import React from "react";
import { CodebookDatabaseAPI } from "@/lib/db";
import { auth } from "@/auth";
import ProblemClient from "./ProblemClient";
import Markdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    div: [...(defaultSchema.attributes?.div || []), ["className", /^katex/]],
    span: [...(defaultSchema.attributes?.span || []), ["className", /^katex/]],
  },
};

export default async function SolvePage({ params }) {
  const { problemId } = await params;
  const problem =
    await CodebookDatabaseAPI.Problems.getProblemByProblemId(problemId);
  const problemCreator = await CodebookDatabaseAPI.Users.getUserById(
    problem.userId,
  );
  const usersSolved = await CodebookDatabaseAPI.Problems.UserSolves.getUsersSolvedProblem(problem.problemId)
  const solveCount = usersSolved.length;
  const session = await auth();

  let lastVote = null;
  let userHasSolved = null;
  if (session?.user?.id) {
    lastVote = await CodebookDatabaseAPI.Problems.Votes.getUserProblemVote(
      session.user.id,
      problem.problemId,
    );
    userHasSolved = await CodebookDatabaseAPI.Problems.UserSolves.getUserSolvedProblem(session.user.id, problem.problemId);
  }

  if (!problem) {
    return <h1>Problem {problemId} not found</h1>;
  }

  const renderedMarkdown = (
    <div className="problem-markdown text-sm">
      <Markdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[[rehypeSanitize, sanitizeSchema], rehypeKatex]}
      >
        {problem.description}
      </Markdown>
    </div>
  );

  return (
    <ProblemClient
      problem={problem}
      problemCreator={problemCreator}
      description={renderedMarkdown}
      lastVote={lastVote}
      initialSolveCount={solveCount}
      userHasSolved={userHasSolved}
    />
  );
}
