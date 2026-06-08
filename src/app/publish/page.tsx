"use client";

import { useState, useRef } from "react";
import { problems } from "@/lib/data";
import { addProblem, addTestCasedb } from "./actions";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Group, Panel, Separator } from "react-resizable-panels";
import { toast } from "sonner";
import Markdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import SplitPane from "@/components/SplitPane";
import Editor from "@monaco-editor/react";
import Card from "@/components/Card";

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    div: [...(defaultSchema.attributes?.div || []), ["className", /^katex/]],
    span: [...(defaultSchema.attributes?.span || []), ["className", /^katex/]],
  },
};

export default function Publish() {
  const descriptionEditorRef = useRef(null);
  const codeEditorRef = useRef(null);
  const [currentDescriptionTab, setCurrentDescriptionTab] = useState("editor");
  const [currentCodeTab, setCurrentCodeTab] = useState("cpp");
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(
    `Use __Markdown__ to describe your coding problem.\n\n*Tip: View rendered Markdown in preview tab.*\n\n### Input\n\nProvide input specifications and constraints.\n\nUse $\\LaTeX$ notation to render math formulas:\n\n$-10^5\\le n\\le 10^5$\n\n### Output\n\nProvide expected output specifications and show examples.\n\n### Examples\n**Example 1**\n\`\`\`\nInput:2\nOutput:4\nExplanation: 2 * 2 = 4\n\`\`\`\n**Example 2**\n\`\`\`\nInput:3\nOutput:6\nExplanation: 3 * 2 = 6\n\`\`\``,
  );
  const [id, setCount] = useState(2);
  const [hiddenCase, setHidden] = useState([]);

  // stores test cases
  const [testCases, setTestCase] = useState({
    [1]: { input: "", output: "" },
  });

  // stores starter code for respective languages
  const [starterCode, setStarterCode] = useState({
    cpp: `/*\nYou can provide users with starter code for each of the supported languages.\n\nNote: Codebook uses standard I/O for test case validation.\nIf you want to abstract that from the user, you can use the following pattern:\n*/\n\n#include <iostream>\n\n// User-facing function where they write their logic:\nint solve(int n) {\n\t// Leave a comment for the user, instructing them to write their code here.\n\treturn 0;\n}\n\n// Main manages standard I/O:\nint main() {\n\tint n;\n\tstd::cin >> n;\n\tstd::cout << solve(n);\n\treturn 0;\n}`,
    python: "",
    java: "",
  });

  // tabs for description panel
  const descriptionTabs = [
    { id: "editor", label: "Write" },
    { id: "preview", label: "Preview" },
  ];

  // tabs for starter code panel
  const codeTabs = [
    { id: "cpp", label: "C++" },
    { id: "python", label: "Python" },
    { id: "java", label: "Java" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (trimmedTitle == "" || trimmedDescription == "") {
      if (trimmedTitle == "" && trimmedDescription == "") {
        toast.error("You're missing a title and description");
      } else if (trimmedTitle == "") {
        toast.error("You're missing a title");
      } else {
        toast.error("You're missing a description");
      }

      return;
    } else {
      const result = verifyTestCases();

      if (result == "success") {
        // TODO: pass starterCode in once new column is implemented
        let probData = await addProblem(trimmedTitle, trimmedDescription, session.user.id);
        addAllTestCases(probData);
        toast.success("Problem published!");
        return;
      } else {
        toast.error(result);
      }
    }
  };

  // adds a test case
  const addCase = () => {
    setTestCase((prev) => {
      const keys = Object.keys(prev).map(Number);
      const nextId = keys.length > 0 ? Math.max(...keys) + 1 : 1;
      return {
        ...prev,
        [nextId]: { input: "", output: "" },
      };
    });
  };

  // removes a test case
  const removeCase = (idToRemove: string) => {
    setTestCase((prev) => {
      const copy = { ...prev };
      delete copy[idToRemove];
      return copy;
    });

    setHidden((prev) => prev.filter((id) => id !== Number(idToRemove)));
  };

  const updateCase = (id, edited, value) => {
    setTestCase((prev) => ({
      ...prev,
      [id]: { ...prev[id], [edited]: value },
    }));
  };

  const addAllTestCases = (problemId) => {
    console.log("Submitting test cases under problemId" + problemId);
    for (const [id, data] of Object.entries(testCases)) {
      addTestCasedb(
        problemId,
        data.input,
        data.output,
        hiddenCase.includes(Number(id)) ? false : true, // If it is in the hidden array, it should be hiddne.
      );
    }
  };

  // verifies that the test cases are valid
  const verifyTestCases = () => {
    const verifyCaseEntry = ([id, data]) => {
      return !(data.input == "" || data.output == "");
    };

    // verify that all test case fields are populated
    for (const [id, data] of Object.entries(testCases)) {
      if (!verifyCaseEntry([id, data])) {
        return `Test case ${id} has empty fields.`;
      }
    }

    // removing this for now since we don't care about types
    //
    //let inputForceArr = false;
    //let outputForceArr = false;

    //// Next, we check if entries are consistent. If one input contains an array, all should.

    //// What type is our passed in string? Is it an array? Is it a number? Perhaps, even a string?
    //const typeOf = (str) => {
    //  try {
    //    const parsed = JSON.parse(str);
    //    if (Array.isArray(parsed)) return "array";
    //    return typeof parsed; // This is the case for NUMBERS, objects, bools, etc.
    //  } catch (e) {
    //    // JSON.parse() struggles with strings, so any error caught is a string.
    //    return "string";
    //  }
    //};

    //const [firstId, firstData] = Object.entries(testCases)[0];
    //const inputType = typeOf(firstData.input);
    //const outputType = typeOf(firstData.output);

    //for (const [id, data] of Object.entries(testCases)) {
    //  if (typeOf(data.input) !== inputType) {
    //    return `Case ${id}'s input is a ${typeOf(data.input)}. Did you mean a ${inputType}?`;
    //  }

    //  if (typeOf(data.output) !== outputType) {
    //    return `Case ${id}'s output is a ${typeOf(data.output)}. Did you mean a ${outputType}?`;
    //  }
    //}

    // verify that at least one test case is visible
    let totalHidden = 0;
    let totalAmount = 0;
    for (const [id, data] of Object.entries(testCases)) {
      if (hiddenCase.includes(Number(id))) {
        totalHidden++;
      }
      totalAmount++;
    }

    if (totalHidden == totalAmount) {
      return "Please make at least 1 test case visible";
    }

    return "success";
  };

  const updateHidden = (id) => {
    const targetId = Number(id);

    setHidden((prev) => {
      if (prev.includes(targetId)) {
        return prev.filter((item) => item !== targetId);
      } else {
        return [...prev, targetId];
      }
    });
  };

  // may remove this soon as it is no longer needed
  const testExport = (e) => {
    e.preventDefault();
    for (let i = 0; i < problems.length; i++) {
      console.log(
        problems[i].id +
          " : " +
          problems[i].title +
          "  |  " +
          problems[i].description,
      );
    }
  };

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="w-full h-full min-h-0 flex-1 flex flex-col h-full overflow-hidden">
      <div className="flex items-center rounded-lg bg-monaco-dark p-2 mb-2 h-12 outline-1 outline-transparent focus-within:outline-monaco-light focus-within:outline-offset-[-1px]">
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title for your problem."
          className="w-full h-full rounded-lg bg-monaco-dark text-monaco-txt font-semibold text-xl border-none outline-none p-3"
        />
        <button
          type="submit"
          onClick={handleSubmit}
          className="cursor-pointer text-sm font-bold h-full px-32 ml-2 rounded-lg bg-monaco-mid text-green-500 hover:bg-green-700 hover:text-monaco-txt transition-colors"
        >
          Publish
        </button>
      </div>
      <SplitPane
        left={
          <div className="h-full overflow-y-auto">
            <Card
              title="Description"
              tabs={descriptionTabs}
              activeTab={currentDescriptionTab}
              onTabChange={setCurrentDescriptionTab}
            >
              <div
                className={
                  currentDescriptionTab === "editor"
                    ? "h-full w-full pb-1"
                    : "hidden"
                }
              >
                <Editor
                  onMount={(editor) => {
                    descriptionEditorRef.current = editor;
                    descriptionEditorRef.current.focus();
                  }}
                  height="100%"
                  language="markdown"
                  theme="vs-dark"
                  value={description}
                  onChange={(newValue) => setDescription(newValue || "")}
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
                    lineNumbers: "off",
                    folding: false,
                    lineDecorationsWidth: 0,
                    lineNumbersMinChars: 0,
                  }}
                />
              </div>
              <div
                className={
                  currentDescriptionTab === "preview"
                    ? "h-full w-full"
                    : "hidden"
                }
              >
                <div className="problem-markdown text-sm pb-64">
                  <Markdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[
                      [rehypeSanitize, sanitizeSchema],
                      rehypeKatex,
                    ]}
                  >
                    {description}
                  </Markdown>
                </div>
              </div>
            </Card>
          </div>
        }
        right={
          <Group
            orientation="vertical"
            className="flex flex-col flex-1 min-h-0 overflow-y-auto"
          >
            <Panel defaultSize="70%" minSize="30%" maxSize="70%">
              <Card
                title="Starter Code"
                tabs={codeTabs}
                activeTab={currentCodeTab}
                onTabChange={setCurrentCodeTab}
              >
                <Editor
                  className="pb-1"
                  onMount={(editor) => {
                    codeEditorRef.current = editor;
                    codeEditorRef.current.focus();
                  }}
                  height="100%"
                  language={currentCodeTab}
                  theme="vs-dark"
                  value={starterCode[currentCodeTab]}
                  onChange={(newValue) => {
                    setStarterCode((prev) => ({
                      ...prev,
                      [currentCodeTab]: newValue ?? "",
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
                  }}
                />
              </Card>
            </Panel>
            <Separator className="group h-0.5 my-0.75 self-stretch bg-transparent rounded-full hover:bg-monaco-muted active:bg-blue-500 transition-colors duration-150 cursor-col-resize flex items-center justify-center">
              <div className="h-0.5 w-8 bg-monaco-mid rounded-full group-hover:bg-transparent group-active:bg-transparent transition-colors duration-150" />
            </Separator>
            <Panel>
              <Card title="Test Cases">
                <div className="flex flex-col p-1 pb-6 gap-2">
                  {Object.entries(testCases).map(([id, data]) => {
                    const isHidden = hiddenCase.includes(Number(id));
                    return (
                      <div
                        key={id}
                        className="flex items-center gap-3 px-4 py-2 rounded-lg shadow-lg shadow-black/10 bg-monaco-mid"
                      >
                        <span className="text-sm font-bold text-monaco-txt whitespace-nowrap min-w-[60px]">
                          Test Case {id}
                        </span>
                        <div className="flex flex-1 items-center gap-3">
                          <input
                            className="flex-1 min-w-0 bg-neutral-900/80 px-3 py-2 rounded-lg text-sm text-monaco-txt focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Input"
                            value={data.input}
                            onChange={(e) => updateCase(id, "input", e.target.value)}
                          />
                          <span className="text-monaco-muted font-bold">→</span>
                          <input
                            className="flex-1 min-w-0 bg-neutral-900/80 px-3 py-2 rounded-lg text-sm text-monaco-txt focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Output"
                            value={data.output}
                            onChange={(e) => updateCase(id, "output", e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => updateHidden(id)}
                            className="group w-6 h-6 p-0.75 mx-1 transition-colors text-monaco-muted hover:text-monaco-txt cursor-pointer"
                          >
                            {isHidden ? 
                              (
                                <svg 
                                  viewBox="0 0 16 16" 
                                  fill="none" 
                                  className="w-full h-full"
                                >
                                  <path 
                                    fillRule="evenodd" 
                                    clipRule="evenodd" 
                                    d="M4 6V4C4 1.79086 5.79086 0 8 0C10.2091 0 12 1.79086 12 4V6H14V16H2V6H4ZM6 4C6 2.89543 6.89543 2 8 2C9.10457 2 10 2.89543 10 4V6H6V4ZM7 13V9H9V13H7Z" 
                                    fill="currentColor"
                                  />
                                </svg>
                              ) : (
                                <svg 
                                  viewBox="0 0 16 16" 
                                  fill="none" 
                                  className="w-full h-full"
                                >
                                  <path 
                                    fillRule="evenodd" 
                                    clipRule="evenodd" 
                                    d="M11.5 2C10.6716 2 10 2.67157 10 3.5V6H13V16H1V6H8V3.5C8 1.567 9.567 0 11.5 0C13.433 0 15 1.567 15 3.5V4H13V3.5C13 2.67157 12.3284 2 11.5 2ZM9 10H5V12H9V10Z" 
                                    fill="currentColor"
                                  />
                                </svg>
                              )
                            }
                          </button>
                          <button
                            type="button"
                            onClick={() => removeCase(id)}
                            className="w-6 h-6 p-1 text-monaco-muted hover:text-monaco-txt transition-all cursor-pointer"
                          >
                            <svg 
                              viewBox="0 0 16 16" 
                              className="w-full h-full"
                              fill="currentColor"
                            >
                              <path 
                                d="M0 14.545L1.455 16 8 9.455 14.545 16 16 14.545 9.455 8 16 1.455 14.545 0 8 6.545 1.455 0 0 1.455 6.545 8z" 
                                fillRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  <div className="flex justify-center pt-2 mt-1">
                    <button
                      type="button"
                      onClick={addCase}
                      className="group w-12 h-12 rounded-xl bg-monaco-mid p-4 hover:bg-monaco-light shadow-xl shadow-black/10 cursor-pointer"
                    >
                      <svg 
                        viewBox="0 0 21 20" 
                        fill="none" 
                        className="w-4 h-4 text-monaco-muted group-hover:text-monaco-txt transition-colors"
                      >
                        <polygon 
                          points="21 9 21 11 11.55 11 11.55 20 9.45 20 9.45 11 0 11 0 9 9.45 9 9.45 0 11.55 0 11.55 9" 
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </Card>
            </Panel>
          </Group>
        }
        layout="standard"
      />
    </div>
  );
}
