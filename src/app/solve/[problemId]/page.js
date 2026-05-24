import React from "react";
import { CodebookDatabaseAPI } from "@/lib/db";
import ProblemClient from "./ProblemClient";
import Markdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";

export default async function SolvePage({ params }) {
  const { problemId } = await params;
  const problem = await CodebookDatabaseAPI.getProblemById(problemId);
  const problemCreator = await CodebookDatabaseAPI.getUserById(problem.userId);

  if (!problem) {
    return <h1>Problem {problemId} not found</h1>;
  }

  const renderedMarkdown = (
    <div className="problem-markdown text-sm">
      <Markdown rehypePlugins={[rehypeSanitize]}>{problem.description}</Markdown>
    </div>
  );

  return (
    <ProblemClient
      problem={problem}
      problemCreator={problemCreator}
      description={renderedMarkdown}
    />
  );
}
