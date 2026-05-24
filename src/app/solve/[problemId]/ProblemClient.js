"use client";
import { useState, useRef, useEffect } from "react";
import { saveCode, getResults, runCode } from "./actions";
import { Group, Panel, Separator } from "react-resizable-panels";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import Editor from "@monaco-editor/react";
import SplitPane from "../../../components/SplitPane";
import TestcaseBlock from "../../../components/TestcaseBlock";
import taunts from "./taunts.js";
import Link from "next/link";

const LANGUAGES = ["c++", "python", "java"];

export default function ProblemClient({
  problem,
  problemCreator,
  description,
}) {
  const editorRef = useRef(null);
  const vimInstanceRef = useRef(null);
  const dropdownRef = useRef(null);
  const [results, setResults] = useState(null);
  const [status, setStatus] = useState("");
  const [vimEnabled, setVimEnabled] = useState(false);
  const [language, setLanguage] = useState("c++");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [taunt] = useState(() => {
    if (taunts && taunts.length > 0) {
      const randomIndex = Math.floor(Math.random() * taunts.length);
      return taunts[randomIndex];
    }
  });

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

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async () => {
    if (!editorRef.current) return;
    const code = editorRef.current.getValue();

    setStatus("Submitting code...");
    const submissionId = await saveCode(problem.id, code);

    setStatus("Running tests...");
    const data = await runCode(problem.problemId || problem.id, language, code);

    setResults(data);
    setStatus("Done");
  };

  return (
    <div className="w-full h-full min-h-0 flex-1">
      <SplitPane
        left={
          <div className="h-full overflow-y-auto">
            <Card title="Description">
              <h1 className="text-2xl font-bold text-monaco-txt pt-2">
                {problem.title}
              </h1>
              <div className="flex text-xs text-monaco-muted pb-4">
                <h1 className="pr-1">By</h1>
                <Link href={`/profile/${problemCreator?.userId ?? 1}`}>
                  <h1 className="hover:underline hover:text-blue-500">
                    {problemCreator?.username ??
                      problemCreator?.displayName ??
                      "Unknown Author"}
                  </h1>
                </Link>
              </div>
              <hr className="border-t border-monaco-muted pt-4"></hr>
              {description}
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
                optionsLeft={
                  <div
                    className="flex items-center gap-1.5 relative"
                    ref={dropdownRef}
                  >
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="group text-xs font-semibold text-monaco-muted hover:text-white transition-all duration-150 capitalize flex items-center gap-1"
                    >
                      {language}
                      <svg
                        viewBox="0 0 512 298.04"
                        className="w-2.5 h-2.5 fill-current text-monaco-muted shrink-0 duration-150 group-hover:text-white"
                      >
                        <g>
                          <path d="M12.08 70.78c-16.17-16.24-16.09-42.54.15-58.7 16.25-16.17 42.54-16.09 58.71.15L256 197.76 441.06 12.23c16.17-16.24 42.46-16.32 58.71-.15 16.24 16.16 16.32 42.46.15 58.7L285.27 285.96c-16.24 16.17-42.54 16.09-58.7-.15L12.08 70.78z" />
                        </g>
                      </svg>
                    </button>
                    {dropdownOpen && (
                      <div className="absolute top-full left-0 w-32 bg-monaco-mid border border-monaco-muted rounded-xl z-50 overflow-hidden">
                        {LANGUAGES.map((lang) => (
                          <button
                            key={lang}
                            onClick={() => {
                              setLanguage(lang);
                              setDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-1.5 text-xs transition-colors duration-150 capitalize ${
                              language === lang
                                ? "bg-monaco-mid text-white font-medium"
                                : "text-monaco-muted hover:bg-monaco-light hover:text-white"
                            }`}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                }
                optionsRight={
                  <button
                    onClick={() => setVimEnabled(!vimEnabled)}
                    className={`transition-all duration-150 hover:text-white ${
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
                {!results && !status && (
                  <div className="flex flex-col items-center justify-center h-full text-center py-8">
                    <p
                      suppressHydrationWarning
                      className="text-xl text-monaco-mid font-bold"
                    >
                      {taunt}
                    </p>
                  </div>
                )}
                {!results && status && <p>{status}</p>}
                {results && (
                  <>
                    <h2
                      className={`mb-4 px-4 text-xl font-bold flex ${results.verdict === "Accepted" ? "text-green-400" : "text-red-400"}`}
                    >
                      <div className="mr-auto">{results.verdict}</div>
                      <div className="flex ml-auto">
                        <div>{results.passedCount}</div>
                        <div className="px-4 text-monaco-txt">/</div>
                        <div className="text-monaco-txt">
                          {results.totalTests}{" "}
                          {/* Changed this because we hide test cases entirely, so we have a diff var now. */}
                        </div>
                      </div>
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
