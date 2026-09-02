"use client";

import Link from "next/link";
import { JSX } from "react";

export default function HomeClient(): JSX.Element {
  return (
    <div className="relative flex flex-col h-[calc(100vh-4rem)] w-full items-center justify-center bg-background overflow-hidden">
      <div className="text-monaco-txt font-mono text-sm w-180">
        {`> `}Welcome to codebook.
      </div>
      <div className="text-sm font-mono text-monaco-txt mt-4 w-180">
        {`> `}codebook is a platform for hosting custom LeetCode-style programming problems. 
      </div>
      <div className="text-sm font-mono text-monaco-txt mt-4 w-180">
        {`> `}Find out more about codebook
        {
          <Link
            href="/about"
          >
            <button 
              className="border border-yellow-600 hover:bg-yellow-600 cursor-pointer text-yellow-600 hover:text-monaco-txt transition-colors px-2 py-1 -my-1 rounded-lg ml-2"
            >
              here
            </button>
          </Link>
        }
        ,
      </div>
      <div className="text-sm font-mono text-monaco-txt mt-4 w-180">
        {`> `}or visit our 
        {
          <Link
            href="/guide"
          >
            <button 
              className="border border-green-600 hover:bg-green-600 cursor-pointer text-green-600 hover:text-monaco-txt transition-colors px-2 py-1 -my-1 rounded-lg mx-2"
            >
              Guide page
            </button>
          </Link>
        }
        for comprehensive documentation of her features.
      </div>
      <div className="text-sm font-mono text-monaco-txt mt-4 w-180">
        {`> `}Found a bug? Drop us a line on 
        {
          <Link
            href="https://github.com/codebook-org/codebook"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button 
              className="border border-blue-500 hover:bg-blue-500 cursor-pointer text-blue-500 hover:text-monaco-txt transition-colors px-2 py-1 -mt-1 rounded-lg ml-2"
            >
                GitHub
            </button>
          </Link>
        }
        .
      </div>
      <div className="mb-64 text-sm flex items-center font-mono text-monaco-txt mt-4 w-180">
        {`> `}
        <div className="inline-block h-[1.1em] w-[0.55em] ml-2 bg-current animate-[blink_1s_steps(2,start)_infinite]" />
      </div>
    </div>
  );
}
