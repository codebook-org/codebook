import { CodebookDatabaseAPI } from "@/lib/db";
import ProbLibClient from "./ProbLibClient";

export default async function ProblemsPage() {
  const problems = await CodebookDatabaseAPI.getProblems();
  return <ProbLibClient problems={problems ?? []} />;
}