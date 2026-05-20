import React from "react";
import { CodebookDatabaseAPI } from "@/lib/db";
import ProblemClient from "./ProblemClient";

export default async function SolvePage({ params }) {
  const { problemId } = await params;

  const problem = await CodebookDatabaseAPI.getProblemById(problemId);

  const problemCreator = await CodebookDatabaseAPI.getUserById(problem.userId);

  if (!problem) {
    return <h1>Problem {problemId} not found</h1>;
  }

  console.log("DEBUG CREATOR DETAILS:", problemCreator);

  return <ProblemClient problem={problem} problemCreator={problemCreator} />;
}
