"use client";

import { JSX } from "react";

export default function HomeClient(): JSX.Element {
  return (
    <div className="relative flex h-[calc(100vh-4rem)] w-full items-center justify-center bg-background overflow-hidden">
      <div className="flex items-center justify-center text-monaco-txt font-mono mb-64 font-semibold tracking-tight">
        welcome to codebook
        <span className="ml-0.5 inline-block h-4 w-2.25 mb-1 bg-current animate-[blink_1s_steps(2,start)_infinite]" />
      </div>
    </div>
  );
}
