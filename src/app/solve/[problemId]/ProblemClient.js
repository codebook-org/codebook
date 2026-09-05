"use client";
import { useState, useRef, useEffect } from "react";
import {
  saveCode,
  getResults,
  runCode,
  submitVote,
  recordSolve,
} from "./actions";
import { Group, Panel, Separator } from "react-resizable-panels";
import { useSession } from "next-auth/react";
import { toClipboard } from "@/utils/toClipboard";
import { toast } from "sonner";
import {
  ThumbsUp,
  ThumbsDown,
  CircleCheck,
  SquareArrowOutUpRight,
  RotateCcw,
  CloudUpload,
  TextAlignStart,
  Code,
  ListChecks,
  GamepadDirectional,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "../../../components/Card";
import Editor from "@monaco-editor/react";
import SplitPane from "../../../components/SplitPane";
import TestcaseBlock from "../../../components/TestcaseBlock";
import Link from "next/link";
import Tooltip from "@/components/Tooltip";
import Confirmation from "@/components/Confirmation";
import Loader from "@/components/Loader";
import SolveCelebration from "@/components/SolveCelebration";

const LANGUAGES = ["c++", "python", "java"];
const KEYBINDS = ["standard", "vim"];

export default function ProblemClient({
  problem,
  problemCreator,
  description,
  lastVote,
  initialSolveCount,
  userHasSolved,
}) {
  const { session } = useSession();
  const editorRef = useRef(null);
  const vimInstanceRef = useRef(null);
  const languageDropdownRef = useRef(null);
  const keybindDropdownRef = useRef(null);
  const [results, setResults] = useState(null);
  const [status, setStatus] = useState("");
  const [favorited, setFavorited] = useState(false); // TODO: check if already favorited
  const [linkCopied, setLinkCopied] = useState(false);
  const [language, setLanguage] = useState("c++");
  const [keybind, setKeybind] = useState("standard");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [likeCount, setLikeCount] = useState(problem.likeCount);
  const [dislikeCount, setDislikeCount] = useState(problem.dislikeCount);
  const [currentVote, setCurrentVote] = useState(lastVote);
  const [solveCount, setSolveCount] = useState(initialSolveCount);
  const [hasSolved, setHasSolved] = useState(userHasSolved);
  const [code, setCode] = useState(problem.starterCode);
  const [minPanelHeight, setMinPanelHeight] = useState(10);

  useEffect(() => {
    const handleKeybindSwap = async () => {
      if (!editorRef.current) return;

      if (keybind === "vim") {
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

    handleKeybindSwap();
  }, [keybind]);

  useEffect(() => {
    if (!editorRef.current) return;
    editorRef.current.focus();
  }, [language]);

  useEffect(() => {
    function handleClickOutside(event) {
      const clickedLanguage = languageDropdownRef.current?.contains(
        event.target,
      );
      const clickedKeybind = keybindDropdownRef.current?.contains(event.target);

      if (!clickedLanguage && !clickedKeybind) {
        setDropdownOpen(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchVote = async () => {
      if (session?.user?.id) {
        setCurrentVote(lastVote);
      }
    };

    fetchVote();
  }, [session?.user?.id, problem.problemId]);

  const handleSubmit = async () => {
    if (!editorRef.current) return;
    const code = editorRef.current.getValue();
    document.getElementById("test-results").focus();
    setResults(null);

    setStatus("submitting");
    const submissionId = await saveCode(problem.problemId, code);

    setStatus("running");
    const data = await runCode(problem.problemId, language, code);

    setResults(data);
    setStatus("done");
    if (!hasSolved && data.verdict === "Accepted") {
      const result = await recordSolve(problem.problemId);
      if (!result.success) {
        toast.error(result.message);
      } else {
        setHasSolved(true);
        setSolveCount((prev) => prev + 1);
        SolveCelebration();
      }
    }
  };

  const handleReset = async (value) => {
    if (editorRef.current) {
      editorRef.current.setValue(value);
      return true;
    }

    return false;
  };

  const handleVote = async (isLike) => {
    const newVote = currentVote === isLike ? null : isLike;

    const result = await submitVote(problem.problemId, newVote);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    // there may be a more elegent way to write this
    if (currentVote === null) {
      if (newVote === true) setLikeCount((prev) => prev + 1);
      if (newVote === false) setDislikeCount((prev) => prev + 1);
    } else if (currentVote === true) {
      setLikeCount((prev) => prev - 1);
      if (newVote === false) setDislikeCount((prev) => prev + 1);
    } else if (currentVote === false) {
      setDislikeCount((prev) => prev - 1);
      if (newVote === true) setLikeCount((prev) => prev + 1);
    }

    setCurrentVote(newVote);
  };

  return (
    <div className="w-full h-full min-h-0 flex-1">
      <SplitPane
        left={
          <div className="h-full overflow-y-auto">
            <Card
              icon={TextAlignStart}
              title="Description"
              optionsLeft={
                <div className="flex items-center h-full">
                  <div className="flex items-center h-6 pr-3 text-xs">
                    <div className="flex items-center h-[24px]">
                      <Tooltip content="Like">
                        <button
                          className={`flex items-center justify-center h-full px-2.5 py-3.5 rounded-l-lg hover:bg-monaco-light transition-colors font-medium hover:text-monaco-txt gap-2 ${currentVote === true ? "bg-monaco-light text-monaco-txt" : "bg-monaco-mid text-monaco-muted"} cursor-pointer`}
                          onClick={() => handleVote(true)}
                        >
                          <ThumbsUp className="size-4.5" aria-hidden="true" />
                          {likeCount - dislikeCount}
                        </button>
                      </Tooltip>
                      <Tooltip content="Dislike">
                        <button
                          className={`flex items-center justify-center h-full px-2.5 py-3.5 ml-0.5 rounded-r-lg hover:bg-monaco-light transition-colors font-semibold hover:text-monaco-txt ${currentVote === false ? "bg-monaco-light text-monaco-txt" : "bg-monaco-mid text-monaco-muted"} cursor-pointer`}
                          onClick={() => handleVote(false)}
                        >
                          <ThumbsDown className="size-4.5" aria-hidden="true" />
                        </button>
                      </Tooltip>
                    </div>
                    <Tooltip content="Total accepted submissions">
                      <div
                        className={`flex items-center ml-3 font-medium ${hasSolved ? "text-monaco-txt" : "text-monaco-muted"} select-none gap-2`}
                      >
                        {solveCount}
                        <CircleCheck
                          className={`size-4.5 ${hasSolved ? "text-green-500" : "text-monaco-muted"}`}
                          aria-hidden="true"
                        />
                        {hasSolved && (
                          <div className="text-green-500 -ml-1">Solved!</div>
                        )}
                      </div>
                    </Tooltip>
                  </div>
                </div>
              }
              optionsRight={
                <div className="flex items-center h-full">
                  <Tooltip content="Share">
                    <button
                      onClick={async () => {
                        const copySuccessful = await toClipboard(
                          window.location.href,
                        );
                        if (copySuccessful) {
                          setLinkCopied(true);
                          toast.success("Copied link to clipboard!");
                        }
                        setTimeout(() => {
                          setLinkCopied(false);
                        }, 2000);
                      }}
                      className="transition-colors duration-150 p-1.5 cursor-pointer rounded-lg text-monaco-muted hover:bg-monaco-light hover:text-monaco-txt mr-1"
                    >
                      <SquareArrowOutUpRight className="size-4.5" />
                    </button>
                  </Tooltip>
                  <Tooltip content="Favorite">
                    <button
                      onClick={() => setFavorited(!favorited)}
                      className={`transition-colors duration-150 p-1.5 cursor-pointer rounded-lg hover:bg-monaco-light hover:text-monaco-txt
                      ${
                        favorited ? "text-monaco-txt bg-monaco-light" : "text-monaco-muted hover:text-monaco-txt"
                      }`}
                    >
                      <Star 
                        className={`size-4.5 ${favorited && ""}`} />
                    </button>
                  </Tooltip>
                </div>
              }
            >
              <h1 className="text-2xl font-bold text-monaco-txt">
                {problem.title}
              </h1>
              <hr className="border-t border-monaco-light mt-2 mb-2"></hr>
              <div className="flex text-xs text-monaco-muted pb-4">
                <h1 className="pr-1">By</h1>
                <Link href={`/profile/${problemCreator?.userId ?? 1}`}>
                  <h1 className="hover:underline hover:text-blue-500 transition-colors">
                    {problemCreator?.displayName ??
                      problemCreator?.username ??
                      "Unknown Author"}
                  </h1>
                </Link>
              </div>
              <div className="pb-64">{description}</div>
            </Card>
          </div>
        }
        right={
          <Group
            orientation="vertical"
            className="flex flex-col h-full overflow-y-auto"
          >
            <Panel
              defaultSize="70%"
              minSize={`${minPanelHeight}px`}
              maxSize="100%"
            >
              <Card
                icon={Code}
                title="Code"
                getMinHeight={setMinPanelHeight}
                optionsLeft={
                  <div className="flex items-center gap-0.5">
                    <div className="relative" ref={languageDropdownRef}>
                      <Tooltip content="Language">
                        <button
                          onClick={() =>
                            setDropdownOpen(
                              dropdownOpen === "language" ? null : "language",
                            )
                          }
                          className={`group text-xs hover:bg-monaco-light py-1.5 px-8 rounded-lg font-medium text-monaco-muted hover:text-monaco-txt transition-all duration-150 capitalize flex items-center gap-1 ${dropdownOpen === "language" ? "bg-monaco-light text-monaco-txt" : "bg-monaco-mid text-monaco-muted"} cursor-pointer`}
                        >
                          {language}
                        </button>
                      </Tooltip>

                        <AnimatePresence>
                      {dropdownOpen === "language" && (
                            <motion.div
                              key="keybind-dropdown"
                              initial={{ opacity: 0, y: -15 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 0 }}
                              transition={{ duration: 0.15, ease: "easeInOut" }}
                              className="absolute top-full mt-2 left-0 z-[9999] w-48 bg-monaco-dark border p-2 border-monaco-light rounded-2xl shadow-xl shadow-black/30 overflow-hidden"
                            >
                              <div className="flex flex-col gap-1">
                          {LANGUAGES.map((lang) => (
                            <button
                              key={lang}
                              onClick={() => {
                                setLanguage(lang);
                                setDropdownOpen(null);
                              }}
                              className={`w-full text-left px-3 rounded-lg py-2.5 text-xs font-medium transition-colors duration-150 capitalize cursor-pointer ${
                              language === lang
                                        ? "bg-monaco-mid text-monaco-txt"
                                        : "hover:bg-monaco-mid text-monaco-txt"
                                    }`}
                                  >
                                    {lang}
                                  </button>
                                ))}
                              </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                }
                optionsRight={
                  <div className="flex items-center h-full">
                    <div className="relative" ref={keybindDropdownRef}>
                      <Tooltip content="Keybindings">
                        <button
                          onClick={() =>
                            setDropdownOpen(
                              dropdownOpen === "keybinds" ? null : "keybinds",
                            )
                          }
                          className={`group hover:bg-monaco-light p-1.5 mr-1 rounded-lg font-semibold text-monaco-muted hover:text-monaco-txt transition-all duration-150 capitalize flex items-center gap-1 ${dropdownOpen === "keybinds" ? "bg-monaco-light text-monaco-txt" : "text-monaco-muted"} cursor-pointer`}
                        >
                          <GamepadDirectional
                            className="size-4.5"
                          />
                        </button>
                      </Tooltip>
                        <AnimatePresence>
                          {dropdownOpen === "keybinds" && (
                            <motion.div
                              key="keybind-dropdown"
                              initial={{ opacity: 0, y: -15 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 0 }}
                              transition={{ duration: 0.15, ease: "easeInOut" }}
                              className="absolute top-full mt-2 right-0 z-[9999] w-48 bg-monaco-dark border p-2 border-monaco-light rounded-2xl shadow-xl shadow-black/30 overflow-hidden"
                            >
                                <div className="flex flex-col gap-1">
                              {KEYBINDS.map((bind) => (
                                  <button
                                    key={bind}
                                    onClick={() => {
                                      setKeybind(bind);
                                      setDropdownOpen(null);
                                    }}
                                    className={`w-full text-left px-3 rounded-lg py-2.5 text-xs font-medium transition-colors duration-150 capitalize cursor-pointer ${
                                      keybind === bind
                                        ? "bg-monaco-mid text-monaco-txt"
                                        : "hover:bg-monaco-mid text-monaco-txt"
                                    }`}
                                  >
                                    {bind}
                                  </button>
                              ))}
                                </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <Tooltip content="Reset">
                      <Confirmation
                        title="Are you sure?"
                        description="This will revert your code to the default starter code."
                        onConfirm={async () => {
                          const resetSuccessful = await handleReset(
                            problem.starterCode[
                              language === "c++" ? "cpp" : language
                            ],
                          );
                          if (resetSuccessful) toast.success("Code reset!");
                        }}
                      >
                        <button className="group hover:bg-monaco-light p-1.5 rounded-lg font-semibold text-monaco-muted hover:text-monaco-txt transition-all duration-150 capitalize flex items-center gap-1 $ cursor-pointer">
                          <RotateCcw className="size-4.5" />
                        </button>
                      </Confirmation>
                    </Tooltip>
                  </div>
                }
                statusBar={
                  keybind === "vim" && (
                  <div
                    className={`text-monaco-txt font-mono text-xs h-6 px-2 flex items-center bg-monaco-mid`}
                  >
                    <div className="" id="vim-status-bar" />
                  </div>
                  )
                }
                optionsBottom={
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={status !== "" && status !== "done"}
                    className="px-16 py-2 w-full rounded-lg text-sm font-semibold bg-monaco-mid text-green-500 hover:bg-green-700 hover:text-monaco-txt transition-colors cursor-pointer flex items-center justify-center disabled:cursor-not-allowed disabled:bg-yellow-600 disabled:text-monaco-txt"
                  >
                    {status !== "" && status !== "done" ? (
                      ""
                    ) : (
                      <CloudUpload className="size-4.5" strokeWidth={2.5} />
                    )}
                    <span className="ml-2">
                      {status !== "" && status !== "done"
                        ? "Running code..."
                        : "Submit"}
                    </span>
                  </button>
                }
              >
                <Editor
                  onMount={(editor) => {
                    editorRef.current = editor;
                    editorRef.current.focus();
                  }}
                  height="100%"
                  language={language === "c++" ? "cpp" : language}
                  theme="vs-dark"
                  value={code[language === "c++" ? "cpp" : language]}
                  onChange={(newValue) => {
                    setCode((prev) => ({
                      ...prev,
                      [language === "c++" ? "cpp" : language]: newValue ?? "",
                    }));
                  }}
                  options={{
                    minimap: { enabled: false },
                    stickyScroll: { enabled: false },
                    scrollbar: {
                      vertical: "hidden",
                      horizontal: "hidden",
                      handleMouseWheel: true,
                      castShadows: false,
                    },
                    overviewRulerLanes: 0,
                    hideCursorInOverviewRuler: true,
                    overviewRulerBorder: false,
                    renderLineHighlight: "none",
                    glyphMargin: false,
                    fontFamily: "JetBrains Mono",
                    lineNumbers: keybind === "vim" ? "relative" : "on",
                    quickSuggestions: {
                      other: false,
                      comments: false,
                      strings: false,
                    },
                    suggestOnTriggerCharacters: false,
                    wordBasedSuggestions: "off",
                    parameterHints: {
                      enabled: false,
                    },
                    suggest: {
                      showSnippets: false,
                      showWords: false,
                      showKeywords: false,
                      showFunctions: false,
                      showClasses: false,
                    },
                    acceptSuggestionOnEnter: "off",
                    tabCompletion: "off",
                  }}
                />
              </Card>
            </Panel>
            <Separator className="group h-0.5 my-0.75 self-stretch bg-transparent rounded-full hover:bg-blue-500 transition-colors duration-150 cursor-col-resize flex items-center justify-center">
              <div className="h-0.5 w-8 bg-monaco-mid rounded-full group-hover:bg-transparent group-active:bg-transparent transition-colors duration-150" />
            </Separator>
            <Panel
              defaultSize="30%"
              minSize={`${minPanelHeight}px`}
              maxSize="100%"
            >
              <Card
                id="test-results"
                icon={ListChecks}
                title="Test Result"
                getMinHeight={setMinPanelHeight}
                className={status === "done" ? "animate-flash-blue" : ""}
              >
                {!results && !status && (
                  <div className="flex flex-col items-center justify-center h-full text-center py-8">
                    <div className="text-xs text-monaco-muted font-regular mb-8">
                      You must submit your code to view results.
                    </div>
                  </div>
                )}
                {!results && status && (
                  <div className="flex flex-col items-center justify-center h-full pb-8 text-center">
                    <Loader />
                  </div>
                )}
                {results && results.code === 0 && (
                  <>
                    <h2
                      className={`mb-4 text-xl font-bold flex ${results.verdict === "Accepted" ? "text-green-400" : "text-red-400"}`}
                    >
                      <div className="mr-auto">{results.verdict}</div>
                      <div className="flex ml-auto">
                        <div>{results.passedCount}</div>
                        <div className="px-4 text-monaco-txt">/</div>
                        <div className="text-monaco-txt">
                          {results.totalTests}{" "}
                        </div>
                      </div>
                    </h2>
                    {results.results.map((test, index) => (
                      <TestcaseBlock key={index} test={test} index={index} />
                    ))}
                    {results.totalHiddenTests > 0 && (
                      <div className="flex rounded-lg bg-monaco-mid/50 mb-2 items-center px-4 py-3">
                        <div className="mr-auto font-bold text-monaco-muted">
                          Additional Testcases
                        </div>
                        <div className="flex ml-auto font-semibold">
                          <div
                            className={`${results.hiddenPassedCount === results.totalHiddenTests ? "text-green-500" : "text-red-400"}`}
                          >
                            {results.hiddenPassedCount}
                          </div>
                          <div className="px-2 text-monaco-txt">/</div>
                          <div className="text-monaco-txt">
                            {results.totalHiddenTests}{" "}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {results && results.code === 1 && (
                  <>
                    <h2 className={`mb-4 text-xl font-bold flex text-red-400`}>
                      {results.verdict}
                    </h2>
                    <pre className="p-3 mb-4 rounded-lg bg-red-400/10 text-red-400 text-xs font-mono">
                      {results.stderr}
                    </pre>
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
