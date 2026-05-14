"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { CodebookDatabaseAPI } from "@/lib/db";

type Problem = CodebookDatabaseAPI.Problem;

// ── CARD ─────────────────────────────────────────────────────────────────────
function ProblemCard({ problem }: { problem: Problem }) {
  const { problemId, title, description } = problem;
  return (
    <Link
      href={`/solve/${problemId}`}
      className="flex items-start justify-between gap-6 py-5 border-b border-white/10 hover:pl-2 transition-all duration-100 no-underline text-inherit"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white mb-1">{title}</p>
        <p className="text-xs text-gray-400 leading-relaxed">{description}</p>
      </div>
    </Link>
  );
}

// ── Problems ─────────────────────────────────────────────────────────────────────
export default function ProbLibClient({ problems }: { problems: Problem[] }) {
  const [query, setQuery] = useState<string>("");

  const visible = useMemo(() => {
    if (!query.trim()) return problems;
    const q = query.toLowerCase();
    return problems.filter(({ title, description }) =>
      `${title} ${description}`.toLowerCase().includes(q)
    );
  }, [problems, query]);

  return (
    <div className="min-h-screen bg-[#111111] text-white">

      {/* ── HERO ── */}
      <section className="max-w-2xl mx-auto px-8 pt-16 pb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight leading-tight mb-8">
          Coding Problems
        </h1>
        <div className="flex gap-2 max-w-lg mx-auto">
          <input
            type="text"
            placeholder="Search problems..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-white text-black px-4 py-2.5 text-sm font-mono outline-none border border-transparent focus:outline-2 focus:outline-black placeholder:text-gray-400"
          />
          <button className="bg-white text-black px-5 py-2.5 text-sm font-bold hover:opacity-75 transition-opacity">
            Search
          </button>
        </div>
      </section>

      {/* ── PROBLEM LIST ── */}
      <div className="max-w-3xl mx-auto px-8 pb-16">
        <p className="text-xs font-bold tracking-widest uppercase text-white mb-5 pb-3 border-b border-white">
          Problems — {visible.length} results
        </p>

        <div className="flex flex-col">
          {visible.length === 0 ? (
            <p className="text-gray-500 text-sm py-8">
              No problems match your search.
            </p>
          ) : (
            visible.map((p) => (
              <ProblemCard key={p.problemId} problem={p} />
            ))
          )}
        </div>
      </div>

    </div>
  );
}