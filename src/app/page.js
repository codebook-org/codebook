// to prevent crash due to pre-rendering pages during build
export const dynamic = 'force-dynamic';

import { promises as fs } from "fs";
import path from "path";
import HomeClient from "./HomeClient";

import { CodebookDatabaseAPI } from "@/lib/db";

export default async function HomePage() {
  const problems = await CodebookDatabaseAPI.getProblems();
  return <HomeClient problems={problems} />;
}
