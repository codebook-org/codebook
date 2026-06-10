"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { CodebookDatabaseAPI } from "@/lib/db";

//We can change whatever user information we want to include
//I just did this for now

type Problem = CodebookDatabaseAPI.Problem;

type User = CodebookDatabaseAPI.User;

type Props = {
  user: User;
  solvedProblems: Problem[];
  publishedProblems: Problem[];
};

type Tab = "solved" | "published";

export default function ProfileClient({
  user,
  solvedProblems,
  publishedProblems,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("solved");

  const problems = activeTab === "solved" ? solvedProblems : publishedProblems;
  const count =
    activeTab === "solved"
      ? `${solvedProblems.length} solved`
      : `${publishedProblems.length} published`;

  const initials =
    user?.displayName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() ?? "?";

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      {/* ── HEADER ── */}
      <div className="flex items-center gap-5 pb-6 border-b border-white/10">
        <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-white text-xl font-medium flex-shrink-0">
          {initials}
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-white text-lg font-medium">
            {user.displayName ?? user.username ?? "User"}
          </p>
          {!(user.displayName == user.username) && (
                <p className="text-zinc-400 text-xs font-normal mt-0.5">
                @{user.username || "User"}
                </p>
            )}
        </div>
      </div>

      {/* Temp Bio display, REALLY UGLY AHHHH*/}
      <div className="mt-4 max-w-prose">
        <p className={`text-sm leading-relaxed ${user.bio ? "text-zinc-300" : "text-zinc-500 italic"}`}>
            {user.bio || ""}
        </p>
      </div>

      {/* ── TABS ── */}
      <div className="flex border-b border-white/10 mt-6">
        {(["solved", "published"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === tab
                ? "border-white text-white"
                : "border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            {tab === "solved" ? "Problems solved" : "Published problems"}
          </button>
        ))}
      </div>

      {/* ── PROBLEM LIST ── */}
      <div className="mt-5 flex flex-col gap-2">
        {problems.length === 0 ? (
          <p className="text-gray-500 text-sm py-6">
            {activeTab === "solved"
              ? "No problems solved yet."
              : "No problems published yet."}
          </p>
        ) : (
          problems.map((p) => (
            <Link
              key={p.problemId}
              href={`/solve/${p.problemId}`}
              className="flex items-center justify-between px-4 py-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
            >
              <span className="text-sm text-gray-100">{p.title}</span>
              <span className="text-xs font-mono text-gray-400">
                {p.description.slice(0, 40)}...
              </span>
            </Link>
          ))
        )}

        {problems.length > 0 && (
          <p className="text-xs text-gray-600 mt-1">{count}</p>
        )}
      </div>
    </div>
  );
}
