import { auth } from "@/auth";
import { CodebookDatabaseAPI } from "@/lib/db";
import ProfileClient from "./ProfileClient";
import { redirect } from "next/navigation";

//THIS SHOULD WORK WITH USER INFO PROBABLY HOPEFULLY

// export default async function ProfilePage() {
//   const session = await auth();

//   if (!session?.user) redirect('/');

//   const problems = await CodebookDatabaseAPI.getProblems();

//   return (
//     <ProfileClient
//       user={session.user}
//       solvedProblems={[]}
//       publishedProblems={problems ?? []}
//     />
//   );
// }

const mockUser = {
  name: "Fingus MDingus",
  email: "somethingElseCangoHere@gmail.com",
  image: null,
};

const mockSolved = [
  { problemId: 1, title: "Two Sum", description: "Words words..." },
  { problemId: 2, title: "N-Queens", description: "More words..." },
  { problemId: 4, title: "Invert Binary Tree", description: "Words words..." },
];

const mockPublished = [
  { problemId: 5, title: "Graph Traversal", description: "Something.." },
  { problemId: 6, title: "Min Stack", description: "More Something..." },
];

export default function ProfilePage() {
  return (
    <ProfileClient
      user={mockUser}
      solvedProblems={mockSolved}
      publishedProblems={mockPublished}
    />
  );
}
