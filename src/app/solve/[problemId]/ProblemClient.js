"use client";
import { useState, useRef } from "react";
import { saveCode, getResults, runCode } from "./actions";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import Editor from "@monaco-editor/react";
import SplitPane from "../../../components/SplitPane";
import TestcaseBlock from "../../../components/TestcaseBlock";

export default function ProblemClient({ problem }) {
  const editorRef = useRef(null);
  const [results, setResults] = useState(null);
  const [status, setStatus] = useState("");

  const handleSubmit = async () => {
    if (!editorRef.current) return;
    const code = editorRef.current.getValue();

    setStatus("Submitting code...");
    const submissionId = await saveCode(problem.id, code);

    setStatus("Running tests...");
    const data = await runCode(1, "cpp", code);

    setResults(data);
    setStatus("Done");
  };

  return (
    <SplitPane
      left={
        <Card>
          <h1>{problem.title}</h1>
          <p>{problem.description}</p>
        </Card>
      }
      right={
        <div className="flex flex-col gap-4">
          <Card>
            <Editor
              onMount={(editor) => (editorRef.current = editor)}
              height="400px"
              defaultLanguage="cpp"
              theme="vs-dark"
              value=""
              options={{
                minimap: { enabled: false },
              }}
            />
            <Button type="submit" text="Submit" onClick={handleSubmit} />
          </Card>
          <Card>
            <h1>Test Result</h1>
            {!results && <p>{status}</p>}
            {results && (
              <>
                <h2
                  className={`mb-4 text-xl font-bold ${results.verdict === "Accepted" ? "text-green-400" : "text-red-400"}`}
                >
                  {results.verdict}
                </h2>
                {results.results.map((test, index) => (
                  <TestcaseBlock key={index} test={test} index={index} />
                ))}
              </>
            )}
          </Card>{" "}
        </div>
      }
      layout="standard"
    />
  );
}
