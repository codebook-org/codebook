"use client";

import { JSX } from "react";

export default function HomeClient(): JSX.Element {
  return (
    <div className="relative flex h-[calc(100vh-4rem)] w-full items-center justify-center bg-background overflow-hidden">
      <div className="flex items-center justify-center text-monaco-txt font-mono text-sm mb-64">
        {`> `}welcome to codebook
        <span className="inline-block h-[1.1em] w-[0.55em] bg-current animate-[blink_1s_steps(2,start)_infinite]" />
      </div>
    </div>
  );
}
