import { Check, X } from "lucide-react";

export default function TestcaseBlock({ test, index }) {
  return (
    <details className="group rounded-lg bg-monaco-mid overflow-hidden mb-2 shadow-lg shadow-black/20">
      <summary className="flex items-center justify-between px-4 py-3 cursor-pointer list-none hover:bg-monaco-light transition-colors">
        <span className="font-bold text-monaco-txt group-hover:text-white">
          Testcase {index + 1}
        </span>
        <span>
          {test.passed ? (
            <Check className="size-5 text-green-500" strokeWidth={3} />
          ) : (
            <X className="size-5 text-red-500" strokeWidth={3} />
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
