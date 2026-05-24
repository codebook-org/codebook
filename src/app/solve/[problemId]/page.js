import React from "react";
import { CodebookDatabaseAPI } from "@/lib/db";
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
  const problem = await CodebookDatabaseAPI.getProblemById(problemId);
  const problemCreator = await CodebookDatabaseAPI.getUserById(problem.userId);

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
    />
  );
}
