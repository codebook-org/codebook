import { Check, X } from "lucide-react";

export default function TestcaseBlock({ test, index }) {
  return (
    <details className="group rounded-lg overflow-hidden mb-2">
      <summary className={`flex items-center justify-between px-4 py-3 cursor-pointer list-none ${ test.passed ? "bg-green-500/10 hover:bg-green-500/20" : "bg-red-400/10 hover:bg-red-400/20 transition-colors"}`}>
        <span className={`font-semibold text-sm ${test.passed ? "text-green-500" : "text-red-400"}`}>
          Test case {index + 1}
        </span>
        <span>
          {test.passed ? (
            <Check className="size-5 text-green-500" />
          ) : (
            <X className="size-5 text-red-400" />
          )}
        </span>
      </summary>
      <div className="p-4 pt-4 bg-neutral-950 font-mono text-sm space-y-3">
        <div>
          <p className="text-neutral-500 text-xs mb-1">Input</p>
          <pre className="bg-neutral-900 p-2 rounded-lg">{test.input}</pre>
        </div>
        <div>
          <p className="text-neutral-500 text-xs mb-1">Expected Output</p>
          <pre className="bg-neutral-900 p-2 rounded-lg">{test.expectedOut}</pre>
        </div>
        <div>
          <p className="text-neutral-500 text-xs mb-1">Actual Output</p>
          <pre
            className={`bg-neutral-900 p-2 rounded-lg ${test.passed ? "text-green-500" : "text-red-400"}`}
          >
            {test.actualOut || "\u00A0"}
          </pre>
        </div>
      </div>
    </details>
  );
}
