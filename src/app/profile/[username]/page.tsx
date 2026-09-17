import { CodebookDatabaseAPI } from "@/lib/db";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage({ params }) {
  const { username } = await params;

  if (!username) {
    return (
      <div className="p-6 text-zinc-400 max-w-2xl mx-auto text-center">
        <p className="text-sm font-semibold text-red-400">Invalid Profile</p>
        <p className="text-xs text-zinc-500 mt-1">
          This profile doesn&apos;t exist... Must be locked up somewhere!
        </p>
      </div>
    );
  }

  const userinfo =
    await CodebookDatabaseAPI.Users.getUserByUsername(username);

  if (!userinfo) {
    return (
      <div className="p-6 text-zinc-400 max-w-2xl mx-auto text-center">
        <p className="text-sm font-semibold text-red-400">Profile Not Found</p>
        <p className="text-xs text-zinc-500 mt-1">
          That profile doesn&apos;t exist... Must be locked up somwhere!
        </p>
      </div>
    );
  }

  const publishedProblems =
    await CodebookDatabaseAPI.Problems.getProblemsByUserId(userinfo.userId);

  const rawSolved =
    await CodebookDatabaseAPI.Problems.UserSolves.getProblemsSolvedByUser(
      userinfo.userId,
    );

  const allProblems = await CodebookDatabaseAPI.Problems.getProblems();

  const solvedProblems = (allProblems ?? []).filter((problem) =>
    (rawSolved ?? []).some(
      (solvedItem) => solvedItem.problemId === problem.problemId,
    ),
  );

  return (
    <ProfileClient
      user={userinfo}
      solvedProblems={solvedProblems ?? []}
      publishedProblems={publishedProblems ?? []}
    />
  );
}
