"use client";
import { useState, useRef, useEffect } from "react";
import { saveCode, getResults, runCode } from "./actions";
import { Group, Panel, Separator } from "react-resizable-panels";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import Editor from "@monaco-editor/react";
import SplitPane from "../../../components/SplitPane";
import TestcaseBlock from "../../../components/TestcaseBlock";

export default function ProblemClient({ problem }) {
  const editorRef = useRef(null);
  const vimInstanceRef = useRef(null);
  const [results, setResults] = useState(null);
  const [status, setStatus] = useState("");
  const [vimEnabled, setVimEnabled] = useState(false);

  useEffect(() => {
    const handleVim = async () => {
      if (!editorRef.current) return;

      if (vimEnabled) {
        const { initVimMode } = await import("monaco-vim");
        const status = document.getElementById("vim-status-bar");
        vimInstanceRef.current = initVimMode(editorRef.current, status);
        editorRef.current.focus();
      } else {
        if (vimInstanceRef.current) {
          vimInstanceRef.current.dispose();
          vimInstanceRef.current = null;
          editorRef.current.focus();
        }
      }
    };

    handleVim();
  }, [vimEnabled]);

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
    <div className="w-full h-full min-h-0 flex-1">
      <SplitPane
        left={
          <div className="h-full overflow-y-auto">
            <Card title="Description">
              <h1 className="text-xl font-bold text-monaco-txt py-2">
                {problem.title}
              </h1>
              <h1 className="text-xs text-monaco-muted py-2">By mp248</h1>
              <p className="text-s text-monaco-txt py-2">
                {problem.description}
              </p>
            </Card>
          </div>
        }
        right={
          <Group
            orientation="vertical"
            className="flex flex-col gap-2 h-full overflow-y-auto"
          >
            <Panel defaultSize="80%" minSize="20%" maxSize="80%">
              <Card
                title="Code"
                optionsRight={
                  <button
                    onClick={() => setVimEnabled(!vimEnabled)}
                    className={`rounded transition-all duration-150 hover:text-white ${
                      vimEnabled ? "text-white" : "text-monaco-muted"
                    }`}
                  >
                    <svg viewBox="0 0 15 15" className="w-6 h-5 fill-current">
                      <path d="M7 1H1V4H2V14H5.74031L14 3.67539V1H8V4H9.43248L6 8.11898V4H7V1Z" />
                    </svg>
                  </button>
                }
                statusBar={
                  <div
                    className={`text-monaco-txt text-xs h-6 px-2 flex items-center font-mono -mx-4 ${vimEnabled ? "bg-monaco-mid" : "bg-monaco-dark"}`}
                  >
                    <div className="px-4" id="vim-status-bar" />
                  </div>
                }
              >
                <Editor
                  onMount={(editor) => (editorRef.current = editor)}
                  height="100%"
                  defaultLanguage="cpp"
                  theme="vs-dark"
                  value=""
                  options={{
                    minimap: { enabled: false },
                    scrollbar: {
                      vertical: "hidden",
                      horizontal: "hidden",
                      handleMouseWheel: true,
                    },
                    overviewRulerLanes: 0,
                    hideCursorInOverviewRuler: true,
                    overviewRulerBorder: false,
                    renderLineHighlight: "none",
                    glyphMargin: false,
                    lineNumbers: vimEnabled ? "relative" : "on",
                  }}
                />
              </Card>
            </Panel>
            <div className="w-full flex">
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-16 py-1.5 w-full rounded text-sm font-bold bg-monaco-mid text-green-500 hover:bg-green-700 hover:text-monaco-txt transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <svg viewBox="0 0 500 420" className="w-5 h-5 fill-current">
                  <g>
                    <path
                      d="M344.058,207.506c-16.568,0-30,13.432-30,30v76.609h-254v-76.609c0-16.568-13.432-30-30-30c-16.568,0-30,13.432-30,30
		v106.609c0,16.568,13.432,30,30,30h314c16.568,0,30-13.432,30-30V237.506C374.058,220.938,360.626,207.506,344.058,207.506z"
                    />
                    <path
                      d="M123.57,135.915l33.488-33.488v111.775c0,16.568,13.432,30,30,30c16.568,0,30-13.432,30-30V102.426l33.488,33.488
		c5.857,5.858,13.535,8.787,21.213,8.787c7.678,0,15.355-2.929,21.213-8.787c11.716-11.716,11.716-30.71,0-42.426L208.271,8.788
		c-11.715-11.717-30.711-11.717-42.426,0L81.144,93.489c-11.716,11.716-11.716,30.71,0,42.426
		C92.859,147.631,111.855,147.631,123.57,135.915z"
                    />
                  </g>
                </svg>
                <span>Submit</span>
              </button>
            </div>
            <Separator className="group h-1 self-stretch bg-transparent rounded-full hover:bg-monaco-muted active:bg-blue-500 transition-colors duration-150 cursor-col-resize flex items-center justify-center">
              <div className="h-1 w-8 bg-monaco-mid rounded-full group-hover:bg-transparent group-active:bg-transparent transition-colors duration-150" />
            </Separator>
            <Panel defaultSize="20%" minSize="20%" maxSize="80%">
              <Card title="Test Result">
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
              </Card>
            </Panel>
          </Group>
        }
        layout="standard"
      />
    </div>
  );
}
