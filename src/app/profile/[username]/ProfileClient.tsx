"use client";

import { CodebookDatabaseAPI } from "@/lib/db";
import { useState } from "react";
import { Book, BookOpenCheck } from "lucide-react"; 
import { useSession } from "next-auth/react";
import ProblemListItem from "@/components/ProblemListItem";

type Problem = CodebookDatabaseAPI.DataTypes.Problem;
type User = CodebookDatabaseAPI.DataTypes.User;

type Props = {
  user: User;
  solvedProblems: Problem[];
  publishedProblems: Problem[];
};

type Tab = "published" | "solved";

export default function ProfileClient({
  user,
  solvedProblems,
  publishedProblems,
}: Props) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<Tab>("published");
  const problems =
    activeTab === "solved"
      ? solvedProblems 
      : publishedProblems;

  const initials =
    user?.displayName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() ?? "?";

  const isProfileOwner = Number(session?.user?.id) === user.userId;

  return (
    <div className="max-w-6xl mx-auto px-3 py-10 grid grid-cols-1 lg:grid-cols-4 gap-2 items-stretch">
      <div className="w-full bg-monaco-dark rounded-2xl border border-monaco-light p-5 flex flex-col gap-5 lg:col-span-1 h-full">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700 flex items-center justify-center text-xl font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-monaco-txt text-lg font-medium truncate">
              {user.displayName ?? user.username ?? "User"}
            </p>
            {!(user.displayName == user.username) && (
              <p className="text-monaco-muted text-xs font-normal truncate">
                @{user.username || "User"}
              </p>
            )}
          </div>
        </div>
        
        <div className="w-full pt-3 border-t border-monaco-mid">
          <p className="text-xs text-monaco-muted tracking-wider font-semibold mb-1">
            Bio
          </p>
          <p className={`text-sm leading-relaxed ${user.bio ? "text-monaco-txt" : "text-monaco-muted italic"}`}>
            {user.bio || "This user has not provided a bio."}
          </p>
        </div>
      </div>
      <div className="w-full bg-monaco-dark rounded-2xl border border-monaco-light p-4 flex flex-col md:flex-row gap-6 items-stretch h-[calc(100vh-240px)] min-h-[500px] lg:col-span-3">
        <div className="w-full md:w-56 flex flex-row md:flex-col border-b md:border-b-0 md:border-r border-monaco-mid pb-4 md:pb-0 md:pr-4 gap-1 flex-shrink-0">
          {(["published", "solved"] as Tab[]).map((tab) => {
            const isSelected = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs text-monaco-txt font-medium rounded-lg transition-all duration-200 cursor-pointer w-full justify-start ${
                  isSelected
                    ? "bg-monaco-mid"
                    : "hover:bg-monaco-mid/50"
                }`}
              >
                {tab === "published" ? (
                  <Book className="size-4.5 text-monaco-muted" />
                ) : (
                  <BookOpenCheck className="size-4.5 text-monaco-muted" />
                )}
                <span>{tab === "solved" ? "Solved problems" : "My problems"}</span>
              </button>
            );
          })}
        </div>
        <div className="flex-1 w-full flex flex-col gap-2 overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {problems.length === 0 ? (
            <p className="text-zinc-500 text-sm py-6 text-center md:text-left">
              {activeTab === "solved"
                ? "No problems solved yet."
                : "No problems published yet."}
            </p>
          ) : (
            problems.map((p) => (
              <ProblemListItem
                  key={p.problemId}
                  problem={p}
                  isSolved={session?.user?.solvedProblemIds?.includes(p.problemId) ?? false}
                  showMoreOptions={isProfileOwner && activeTab === "published"}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
