"use client";
import { useState, useRef, useEffect } from "react";
import { saveCode, getResults, runCode, submitVoteAction } from "./actions";
import { Group, Panel, Separator } from "react-resizable-panels";
import { useSession } from "next-auth/react";
import { toClipboard } from "@/utils/toClipboard";
import { toast } from "sonner";
import Card from "../../../components/Card";
import Editor from "@monaco-editor/react";
import SplitPane from "../../../components/SplitPane";
import TestcaseBlock from "../../../components/TestcaseBlock";
import Link from "next/link";
import Tooltip from "@/components/Tooltip";
import Confirmation from "@/components/Confirmation";

const LANGUAGES = ["c++", "python", "java"];
const KEYBINDS = ["standard", "vim"];

export default function ProblemClient({
  problem,
  problemCreator,
  description,
  lastVote,
}) {
  console.log("Passed Prop LastVote:", lastVote);
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
  const { session } = useSession();
  const [likeCount, setLikeCount] = useState(problem.likeCount);
  const [dislikeCount, setDislikeCount] = useState(problem.dislikeCount);
  const [currentVote, setCurrentVote] = useState(lastVote);

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

    const result = await submitVoteAction(problem.problemId, newVote);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

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
              title="Description"
              optionsLeft={
                <div className="flex items-center h-full">
                  <div className="flex items-center h-6 gap-3 rounded-lg bg-neutral-900 pr-3 text-xs text-neutral-300">
                    <div className="flex items-center h-[24px]">
                      <Tooltip content="Upvote">
                        <button
                          className={`flex items-center justify-center h-full px-2 rounded-l-lg hover:bg-monaco-light transition-colors font-semibold hover:text-white gap-2 ${currentVote === true ? "bg-monaco-light text-white" : "bg-monaco-mid text-monaco-muted"}`}
                          onClick={() => handleVote(true)}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="w-4 h-4 fill-current scale-x-110"
                            aria-hidden="true"
                          >
                            <path d="M4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14z" />
                          </svg>
                          {likeCount - dislikeCount}
                        </button>
                      </Tooltip>
                      <Tooltip content="Downvote">
                        <button
                          className={`flex items-center justify-center h-full px-2 ml-0.5 rounded-r-lg hover:bg-monaco-light transition-colors font-semibold hover:text-white gap-2 ${currentVote === false ? "bg-monaco-light text-white" : "bg-monaco-mid text-monaco-muted"}`}
                          onClick={() => handleVote(false)}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="w-4 h-4 fill-current -scale-y-100 scale-x-110"
                            aria-hidden="true"
                          >
                            <path d="M4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14z" />
                          </svg>
                        </button>
                      </Tooltip>
                    </div>
                    <Tooltip content="Total accepted submissions">
                      <div className="flex font-semibold text-monaco-muted select-none gap-2">
                        1,234
                        <svg
                          viewBox="0 0 42 42"
                          className="w-3.5 h-3.5 fill-current"
                          aria-hidden="true"
                        >
                          <path
                            d="M39.04,7.604l-2.398-1.93c-1.182-0.95-1.869-0.939-2.881,0.311L16.332,27.494l-8.111-6.739
	c-1.119-0.94-1.819-0.89-2.739,0.26l-1.851,2.41c-0.939,1.182-0.819,1.853,0.291,2.78l11.56,9.562c1.19,1,1.86,0.897,2.78-0.222
	l21.079-25.061C40.331,9.294,40.271,8.583,39.04,7.604z"
                          />
                        </svg>
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
                      className="mr-4 w-4 h-4 transition-all duration-150 text-monaco-muted hover:text-white"
                    >
                      <svg
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="w-full h-full"
                      >
                        <path d="M7.05025 1.53553C8.03344 0.552348 9.36692 0 10.7574 0C13.6528 0 16 2.34721 16 5.24264C16 6.63308 15.4477 7.96656 14.4645 8.94975L12.4142 11L11 9.58579L13.0503 7.53553C13.6584 6.92742 14 6.10264 14 5.24264C14 3.45178 12.5482 2 10.7574 2C9.89736 2 9.07258 2.34163 8.46447 2.94975L6.41421 5L5 3.58579L7.05025 1.53553Z" />
                        <path d="M7.53553 13.0503L9.58579 11L11 12.4142L8.94975 14.4645C7.96656 15.4477 6.63308 16 5.24264 16C2.34721 16 0 13.6528 0 10.7574C0 9.36693 0.552347 8.03344 1.53553 7.05025L3.58579 5L5 6.41421L2.94975 8.46447C2.34163 9.07258 2 9.89736 2 10.7574C2 12.5482 3.45178 14 5.24264 14C6.10264 14 6.92742 13.6584 7.53553 13.0503Z" />
                        <path d="M5.70711 11.7071L11.7071 5.70711L10.2929 4.29289L4.29289 10.2929L5.70711 11.7071Z" />
                      </svg>
                    </button>
                  </Tooltip>
                  <Tooltip content="Save">
                    <button
                      onClick={() => setFavorited(!favorited)}
                      className={`w-4 h-4 transition-all duration-150 hover:text-white ${
                        favorited ? "text-monaco-txt" : "text-monaco-muted"
                      }`}
                    >
                      <svg
                        viewBox="0 0 64 64"
                        fill="currentColor"
                        className="w-full h-full"
                      >
                        <path d="M62.799,23.737c-0.47-1.399-1.681-2.419-3.139-2.642l-16.969-2.593L35.069,2.265 C34.419,0.881,33.03,0,31.504,0c-1.527,0-2.915,0.881-3.565,2.265l-7.623,16.238L3.347,21.096c-1.458,0.223-2.669,1.242-3.138,2.642 c-0.469,1.4-0.115,2.942,0.916,4l12.392,12.707l-2.935,17.977c-0.242,1.488,0.389,2.984,1.62,3.854 c1.23,0.87,2.854,0.958,4.177,0.228l15.126-8.365l15.126,8.365c0.597,0.33,1.254,0.492,1.908,0.492c0.796,0,1.592-0.242,2.269-0.72 c1.231-0.869,1.861-2.365,1.619-3.854l-2.935-17.977l12.393-12.707C62.914,26.68,63.268,25.138,62.799,23.737z" />
                      </svg>
                    </button>
                  </Tooltip>
                </div>
              }
            >
              <h1 className="text-2xl font-bold text-monaco-txt pt-2">
                {problem.title}
              </h1>
              <hr className="border-t border-monaco-muted mt-2 mb-2"></hr>
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
              defaultSize="80%"
              minSize="5.6%"
              maxSize="100%"
              className="pb-2"
            >
              <Card
                title="Code"
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
                          className={`group text-xs hover:bg-monaco-light py-1 px-3 rounded-l-lg font-semibold text-monaco-muted hover:text-white transition-all duration-150 capitalize flex items-center gap-1 ${dropdownOpen === "language" ? "bg-monaco-light text-monaco-txt" : "bg-monaco-mid text-monaco-muted"}`}
                        >
                          {language}
                          <svg
                            viewBox="0 0 512 298.04"
                            className="w-2.5 h-2.5 fill-current shrink-0 duration-150"
                          >
                            <g>
                              <path d="M12.08 70.78c-16.17-16.24-16.09-42.54.15-58.7 16.25-16.17 42.54-16.09 58.71.15L256 197.76 441.06 12.23c16.17-16.24 42.46-16.32 58.71-.15 16.24 16.16 16.32 42.46.15 58.7L285.27 285.96c-16.24 16.17-42.54 16.09-58.7-.15L12.08 70.78z" />
                            </g>
                          </svg>
                        </button>
                      </Tooltip>
                      {dropdownOpen === "language" && (
                        <div className="absolute top-full left-0 w-32 bg-monaco-mid border border-monaco-muted rounded-xl z-50 shadow-xl shadow-black/25 overflow-hidden">
                          {LANGUAGES.map((lang) => (
                            <button
                              key={lang}
                              onClick={() => {
                                setLanguage(lang);
                                setDropdownOpen(null);
                              }}
                              className={`w-full text-left px-3 py-2.5 text-xs transition-colors duration-150 capitalize ${
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
                    <div className="relative" ref={keybindDropdownRef}>
                      <Tooltip content="Keybindings">
                        <button
                          onClick={() =>
                            setDropdownOpen(
                              dropdownOpen === "keybinds" ? null : "keybinds",
                            )
                          }
                          className={`group text-xs hover:bg-monaco-light py-1 px-3 rounded-r-lg font-semibold text-monaco-muted hover:text-white transition-all duration-150 capitalize flex items-center gap-1 ${dropdownOpen === "keybinds" ? "bg-monaco-light text-monaco-txt" : "bg-monaco-mid text-monaco-muted"}`}
                        >
                          {keybind}
                          <svg
                            viewBox="0 0 512 298.04"
                            className="w-2.5 h-2.5 fill-current shrink-0 duration-150"
                          >
                            <g>
                              <path d="M12.08 70.78c-16.17-16.24-16.09-42.54.15-58.7 16.25-16.17 42.54-16.09 58.71.15L256 197.76 441.06 12.23c16.17-16.24 42.46-16.32 58.71-.15 16.24 16.16 16.32 42.46.15 58.7L285.27 285.96c-16.24 16.17-42.54 16.09-58.7-.15L12.08 70.78z" />
                            </g>
                          </svg>
                        </button>
                      </Tooltip>
                      {dropdownOpen === "keybinds" && (
                        <div className="absolute top-full left-0 w-32 bg-monaco-mid border border-monaco-muted rounded-xl z-50 shadow-xl shadow-black/25 overflow-hidden">
                          {KEYBINDS.map((bind) => (
                            <button
                              key={bind}
                              onClick={() => {
                                setKeybind(bind);
                                setDropdownOpen(null);
                              }}
                              className={`w-full text-left px-3 py-2.5 text-xs transition-colors duration-150 capitalize ${
                                keybind === bind
                                  ? "bg-monaco-mid text-white font-medium"
                                  : "text-monaco-muted hover:bg-monaco-light hover:text-white"
                              }`}
                            >
                              {bind}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                }
                optionsRight={
                  <div className="flex items-center h-full">
                    <Tooltip content="Reset">
                      <Confirmation
                        title="Are you sure?"
                        description="This will revert your code to the default starter code."
                        onConfirm={async () => {
                          const resetSuccessful = await handleReset("");
                          if (resetSuccessful) toast.success("Code reset!");
                        }}
                      >
                        <button className="ml-4 w-4 h-4 transition-all duration-150 text-monaco-muted hover:text-white">
                          <svg
                            viewBox="0 0 1920 1920"
                            className="w-4 h-4 fill-current text-monaco-muted hover:text-white transition-colors duration-150 shrink-0"
                          >
                            <path
                              d="M960 0v213.333c411.627 0 746.667 334.934 746.667 746.667S1371.627 1706.667 960 1706.667 213.333 1371.733 213.333 960c0-197.013 78.4-382.507 213.334-520.747v254.08H640V106.667H53.333V320h191.04C88.64 494.08 0 720.96 0 960c0 529.28 430.613 960 960 960s960-430.72 960-960S1489.387 0 960 0"
                              fillRule="evenodd"
                            />
                          </svg>
                        </button>
                      </Confirmation>
                    </Tooltip>
                  </div>
                }
                statusBar={
                  <div
                    className={`text-monaco-txt text-xs h-6 px-2 flex items-center font-mono -mx-4 ${keybind === "vim" ? "bg-monaco-mid" : "bg-monaco-dark"}`}
                  >
                    <div className="px-4" id="vim-status-bar" />
                  </div>
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
                  value=""
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
                    lineNumbers: keybind === "vim" ? "relative" : "on",
                  }}
                />
              </Card>
            </Panel>
            <div className="w-full flex">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={status !== "" && status !== "done"}
                className="px-16 py-1.5 w-full rounded text-sm font-bold bg-monaco-mid text-green-500 hover:bg-green-700 hover:text-monaco-txt transition-colors cursor-pointer flex items-center justify-center disabled:cursor-not-allowed disabled:bg-yellow-600 disabled:text-monaco-txt"
              >
                {status !== "" && status !== "done" ? (
                  ""
                ) : (
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
                )}

                <span>
                  {status !== "" && status !== "done"
                    ? "Running code..."
                    : "Submit"}
                </span>
              </button>
            </div>
            <Separator className="group h-0.5 my-0.75 self-stretch bg-transparent rounded-full hover:bg-monaco-muted active:bg-blue-500 transition-colors duration-150 cursor-col-resize flex items-center justify-center">
              <div className="h-0.5 w-8 bg-monaco-mid rounded-full group-hover:bg-transparent group-active:bg-transparent transition-colors duration-150" />
            </Separator>
            <Panel defaultSize="20%" minSize="4.5%" maxSize="100">
              <Card
                id="test-results"
                title="Test Result"
                className={status === "done" ? "animate-flash-blue" : ""}
              >
                {!results && !status && (
                  <div className="flex flex-col items-center justify-center h-full text-center py-8">
                    <div className="text-sm text-monaco-muted font-regular">
                      You must submit your code to view results.
                    </div>
                  </div>
                )}
                {!results && status && (
                  <div className="flex flex-col items-center justify-center h-full text-center py-8">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-12 h-12 fill-monaco-muted flex-shrink-0"
                    >
                      <circle cx="4" cy="12" r="0">
                        <animate
                          begin="0;spinner_z0Or.end"
                          attributeName="r"
                          calcMode="spline"
                          dur="0.5s"
                          keySplines=".36,.6,.31,1"
                          values="0;3"
                          fill="freeze"
                        />
                        <animate
                          begin="spinner_OLMs.end"
                          attributeName="cx"
                          calcMode="spline"
                          dur="0.5s"
                          keySplines=".36,.6,.31,1"
                          values="4;12"
                          fill="freeze"
                        />
                        <animate
                          begin="spinner_UHR2.end"
                          attributeName="cx"
                          calcMode="spline"
                          dur="0.5s"
                          keySplines=".36,.6,.31,1"
                          values="12;20"
                          fill="freeze"
                        />
                        <animate
                          id="spinner_lo66"
                          begin="spinner_Aguh.end"
                          attributeName="r"
                          calcMode="spline"
                          dur="0.5s"
                          keySplines=".36,.6,.31,1"
                          values="3;0"
                          fill="freeze"
                        />
                        <animate
                          id="spinner_z0Or"
                          begin="spinner_lo66.end"
                          attributeName="cx"
                          dur="0.001s"
                          values="20;4"
                          fill="freeze"
                        />
                      </circle>
                      <circle cx="4" cy="12" r="3">
                        <animate
                          begin="0;spinner_z0Or.end"
                          attributeName="cx"
                          calcMode="spline"
                          dur="0.5s"
                          keySplines=".36,.6,.31,1"
                          values="4;12"
                          fill="freeze"
                        />
                        <animate
                          begin="spinner_OLMs.end"
                          attributeName="cx"
                          calcMode="spline"
                          dur="0.5s"
                          keySplines=".36,.6,.31,1"
                          values="12;20"
                          fill="freeze"
                        />
                        <animate
                          id="spinner_JsnR"
                          begin="spinner_UHR2.end"
                          attributeName="r"
                          calcMode="spline"
                          dur="0.5s"
                          keySplines=".36,.6,.31,1"
                          values="3;0"
                          fill="freeze"
                        />
                        <animate
                          id="spinner_Aguh"
                          begin="spinner_JsnR.end"
                          attributeName="cx"
                          dur="0.001s"
                          values="20;4"
                          fill="freeze"
                        />
                        <animate
                          begin="spinner_Aguh.end"
                          attributeName="r"
                          calcMode="spline"
                          dur="0.5s"
                          keySplines=".36,.6,.31,1"
                          values="0;3"
                          fill="freeze"
                        />
                      </circle>
                      <circle cx="12" cy="12" r="3">
                        <animate
                          begin="0;spinner_z0Or.end"
                          attributeName="cx"
                          calcMode="spline"
                          dur="0.5s"
                          keySplines=".36,.6,.31,1"
                          values="12;20"
                          fill="freeze"
                        />
                        <animate
                          id="spinner_hSjk"
                          begin="spinner_OLMs.end"
                          attributeName="r"
                          calcMode="spline"
                          dur="0.5s"
                          keySplines=".36,.6,.31,1"
                          values="3;0"
                          fill="freeze"
                        />
                        <animate
                          id="spinner_UHR2"
                          begin="spinner_hSjk.end"
                          attributeName="cx"
                          dur="0.001s"
                          values="20;4"
                          fill="freeze"
                        />
                        <animate
                          begin="spinner_UHR2.end"
                          attributeName="r"
                          calcMode="spline"
                          dur="0.5s"
                          keySplines=".36,.6,.31,1"
                          values="0;3"
                          fill="freeze"
                        />
                        <animate
                          begin="spinner_Aguh.end"
                          attributeName="cx"
                          calcMode="spline"
                          dur="0.5s"
                          keySplines=".36,.6,.31,1"
                          values="4;12"
                          fill="freeze"
                        />
                      </circle>
                      <circle cx="20" cy="12" r="3">
                        <animate
                          id="spinner_4v5M"
                          begin="0;spinner_z0Or.end"
                          attributeName="r"
                          calcMode="spline"
                          dur="0.5s"
                          keySplines=".36,.6,.31,1"
                          values="3;0"
                          fill="freeze"
                        />
                        <animate
                          id="spinner_OLMs"
                          begin="spinner_4v5M.end"
                          attributeName="cx"
                          dur="0.001s"
                          values="20;4"
                          fill="freeze"
                        />
                        <animate
                          begin="spinner_OLMs.end"
                          attributeName="r"
                          calcMode="spline"
                          dur="0.5s"
                          keySplines=".36,.6,.31,1"
                          values="0;3"
                          fill="freeze"
                        />
                        <animate
                          begin="spinner_UHR2.end"
                          attributeName="cx"
                          calcMode="spline"
                          dur="0.5s"
                          keySplines=".36,.6,.31,1"
                          values="4;12"
                          fill="freeze"
                        />
                        <animate
                          begin="spinner_Aguh.end"
                          attributeName="cx"
                          calcMode="spline"
                          dur="0.5s"
                          keySplines=".36,.6,.31,1"
                          values="12;20"
                          fill="freeze"
                        />
                      </circle>
                    </svg>
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
                    <pre className="p-3 mb-4 rounded-lg bg-red-400/10 text-red-400 text-sm font-mono">
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
