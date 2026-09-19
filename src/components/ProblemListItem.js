"use client";

import { Bookmark, CircleCheck } from "lucide-react";
import Link from "next/link";

export default function ProblemListItem({problem, isSolved}) {
  return (
    <Link 
      href={`/solve/${problem.problemId}`}
      className="flex items-center h-12 p-3 bg-monaco-mid/40 hover:bg-monaco-mid/70 border border-monaco-light rounded-xl text-sm transition-colors"
    >
      <Bookmark className="size-4.5 text-monaco-muted mr-2" />
      <span className="text text-monaco-txt">
        {problem.title}
      </span>
      {isSolved &&
        <div className="flex items-center ml-auto text-green-500">
          <CircleCheck className="size-4.5 mr-1" />
          <span className="text-xs">Solved!</span>
        </div>
      }
    </Link>
  );
}
