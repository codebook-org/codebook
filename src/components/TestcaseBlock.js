"use client";

export default function TestcaseBlock({ test, index }) {
  return (
    <details className="group rounded-lg bg-monaco-mid overflow-hidden mb-2">
      <summary className="flex items-center justify-between px-4 py-3 cursor-pointer list-none hover:bg-monaco-light transition-colors">
        <span className="font-bold text-monaco-txt group-hover:text-white">
          Test Case {index + 1}
        </span>
        <span>
          {test.passed ? (
            <svg
              viewBox="0 0 512 512"
              className="w-5 h-5 fill-current text-green-500"
            >
              <path d="M96 448Q82 448 73 439 64 430 64 416L64 96Q64 82 73 73 82 64 96 64L416 64Q430 64 439 73 448 82 448 96L448 416Q448 430 439 439 430 448 416 448L96 448ZM367 192L331 160 230 282 177 229 145 261 234 350 367 192Z" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 512 512"
              className="w-5 h-5 fill-current text-red-500"
            >
              <path d="M96 448Q82 448 73 439 64 430 64 416L64 96Q64 82 73 73 82 64 96 64L416 64Q430 64 439 73 448 82 448 96L448 416Q448 430 439 439 430 448 416 448L96 448ZM256 288L320 352 352 320 288 256 352 192 320 160 256 224 192 160 160 192 224 256 160 320 192 352 256 288Z" />
            </svg>
          )}
        </span>
      </summary>
      <div className="p-4 pt-4 bg-neutral-950 font-mono text-sm space-y-3">
        <div>
          <p className="text-neutral-500 text-xs mb-1">Input</p>
          <pre className="bg-neutral-900 p-2 rounded">{test.input}</pre>
        </div>
        <div>
          <p className="text-neutral-500 text-xs mb-1">Expected Output</p>
          <pre className="bg-neutral-900 p-2 rounded">{test.expectedOut}</pre>
        </div>
        <div>
          <p className="text-neutral-500 text-xs mb-1">Actual Output</p>
          <pre
            className={`bg-neutral-900 p-2 rounded ${test.passed ? "text-green-400" : "text-red-400"}`}
          >
            {test.actualOut || "\u00A0"}
          </pre>
        </div>
      </div>
    </details>
  );
}
