import { auth } from "@/auth";
import { CodebookDatabaseAPI } from "@/lib/db";
import ProfileClient from "./ProfileClient";
import { redirect } from "next/navigation";

//THIS SHOULD WORK WITH USER INFO PROBABLY HOPEFULLY

export default async function ProfilePage({ params }) {
  const { userId } = await params;

  if (!userId || isNaN(userId)) {
    return (
      <div className="p-6 text-zinc-400 max-w-2xl mx-auto text-center">
        <p className="text-sm font-semibold text-red-400">Invalid Profile</p>
        <p className="text-xs text-zinc-500 mt-1">
          This profile doesn't exist... Must be locked up somewhere!
        </p>
      </div>
    );
  }

  const userinfo = await CodebookDatabaseAPI.getUserById(userId);

  const publishedProblems =
    await CodebookDatabaseAPI.getProblemByUserId(userId);

  return (
    <ProfileClient
      user={userinfo}
      solvedProblems={[]}
      publishedProblems={publishedProblems ?? []}
    />
  );
}

// const mockUser = {
//   name: "Fingus MDingus",
//   email: "somethingElseCangoHere@gmail.com",
//   image: null,
// };

// const mockSolved = [
//   { problemId: 1, title: "Two Sum", description: "Words words..." },
//   { problemId: 2, title: "N-Queens", description: "More words..." },
//   { problemId: 4, title: "Invert Binary Tree", description: "Words words..." },
// ];

// const mockPublished = [
//   { problemId: 5, title: "Graph Traversal", description: "Something.." },
//   { problemId: 6, title: "Min Stack", description: "More Something..." },
// ];

// export default function ProfilePage() {
//   return (
//     <ProfileClient
//       user={mockUser}
//       solvedProblems={mockSolved}
//       publishedProblems={mockPublished}
//     />
//   );
// }
