import React from "react";
import { CodebookDatabaseAPI } from "@/lib/db";
import ProblemClient from "./ProblemClient";

export default async function SolvePage({ params }) {
  const { problemId } = await params;

  const problem = await CodebookDatabaseAPI.getProblemById(problemId);

  if (!problem) {
    return <h1>Problem {problemId} not found</h1>;
  }

  return <ProblemClient problem={problem} />;
}
