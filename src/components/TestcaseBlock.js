"use client";

export default function TestcaseBlock({ test, index }) {
  return (
    <details className="group rounded-lg bg-neutral-700 overflow-hidden mb-2">
      <summary className="flex items-center justify-between p-4 cursor-pointer list-none hover:bg-neutral-600 transition-colors">
        <div className="flex items-center gap-3">
          <span className="font-bold">Test Case {index + 1}</span>
          <span className={test.passed ? "text-green-500" : "text-red-500"}>
            {test.passed ? "● Accepted" : "● Wrong Answer"}
          </span>
        </div>
      </summary>
      <div className="p-4 pt-4 border-t border-neutral-700 bg-neutral-950 font-mono text-sm space-y-3">
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
