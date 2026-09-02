"use client";

import { useState, useRef } from "react";
import { addProblem, addTestCasedb } from "./actions";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { Group, Panel, Separator } from "react-resizable-panels";
import { toast } from "sonner";
import { MoveRight, Lock, LockOpen, X, Plus, Upload } from "lucide-react";
import Markdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import SplitPane from "@/components/SplitPane";
import Editor from "@monaco-editor/react";
import Card from "@/components/Card";
import Tooltip from "@/components/Tooltip";
import Confirmation from "@/components/Confirmation";

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    div: [...(defaultSchema.attributes?.div || []), ["className", /^katex/]],
    span: [...(defaultSchema.attributes?.span || []), ["className", /^katex/]],
  },
};

export default function Publish() {
  const router = useRouter();
  const descriptionEditorRef = useRef(null);
  const codeEditorRef = useRef(null);
  const [currentDescriptionTab, setCurrentDescriptionTab] = useState("editor");
  const [currentCodeTab, setCurrentCodeTab] = useState("cpp");
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(
    `Use __Markdown__ to describe your coding problem.\n\n*Tip: View rendered Markdown in preview tab.*\n\n### Input\n\nProvide input specifications and constraints.\n\nUse $\\LaTeX$ notation to render math formulas:\n\n$-10^5\\le n\\le 10^5$\n\n### Output\n\nProvide expected output specifications and show examples.\n\n### Examples\n**Example 1**\n\`\`\`\nInput:2\nOutput:4\nExplanation: 2 * 2 = 4\n\`\`\`\n**Example 2**\n\`\`\`\nInput:3\nOutput:6\nExplanation: 3 * 2 = 6\n\`\`\``,
  );
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

  // publishes the problem
  const handleSubmit = async () => {
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
        let probData = await addProblem(
          trimmedTitle,
          trimmedDescription,
          session.user.id,
          starterCode,
        );
        addAllTestCases(probData);
        toast.success("Problem published!");
        router.replace(`/solve/${probData}`);
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
  const removeCase = (idToRemove) => {
    setTestCase((prev) => {
      const copy = { ...prev };
      delete copy[idToRemove];
      const remainingValues = Object.values(copy);
      const newObject = {};

      remainingValues.forEach((value, index) => {
        const id = String(index + 1);
        newObject[id] = value;
      });

      return newObject;
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
        data.input?.replace(/\\n/g, "\n"),
        data.output?.replace(/\\n/g, "\n"),
        hiddenCase.includes(Number(id)) ? false : true,
      );
    }
  };

  // verifies that the test cases are valid prior to submission
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

  // updates array of hidden test cases
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

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="w-full h-full min-h-0 flex-1 flex flex-col h-full overflow-hidden">
      <div className="flex items-center rounded-lg bg-monaco-dark p-1 mb-2 h-12">
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title for your problem."
          className="w-full h-full rounded-lg bg-black/20 text-monaco-txt font-semibold text-xl border-none focus:ring-2 focus:ring-blue-500 focus:outline-none px-3 py-4"
        />
        <Confirmation
          title="Are you sure?"
          description="You won't be able to edit this problem once it has been published."
          onConfirm={handleSubmit}
        >
          <button
            type="submit"
            className="cursor-pointer flex items-center text-sm font-bold h-8 px-32 m-3 rounded-lg bg-monaco-mid text-green-500 hover:bg-green-700 hover:text-monaco-txt transition-colors shadow-lg shadow-black/20"
          >
            <Upload className="size-4 mr-2" />
            Publish
          </button>
        </Confirmation>
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
                    fontFamily: "JetBrains Mono",
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
            <Panel defaultSize="70%" minSize="4.65%" maxSize="95.35%">
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
                    fontFamily: "JetBrains Mono",
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
                        className="flex items-center gap-3 px-4 py-2 rounded-lg shadow-lg shadow-black/20 bg-monaco-mid"
                      >
                        <span className="text-sm font-bold text-monaco-txt whitespace-nowrap min-w-[60px]">
                          Test Case {id}
                        </span>
                        <div className="flex flex-1 items-center gap-3">
                          <input
                            className="flex-1 min-w-0 bg-neutral-900/80 px-3 py-2 font-mono rounded-lg text-sm text-monaco-txt focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Input"
                            value={data.input}
                            onChange={(e) =>
                              updateCase(id, "input", e.target.value)
                            }
                          />
                          <MoveRight className="size-4.5 text-monaco-muted" />
                          <input
                            className="flex-1 min-w-0 bg-neutral-900/80 px-3 py-2 font-mono rounded-lg text-sm text-monaco-txt focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Output"
                            value={data.output}
                            onChange={(e) =>
                              updateCase(id, "output", e.target.value)
                            }
                          />
                          <Tooltip
                            content={`${isHidden ? "Show test case" : "Hide test case"}`}
                          >
                            <button
                              type="button"
                              onClick={() => updateHidden(id)}
                              className="transition-colors ml-1 text-monaco-muted hover:text-monaco-txt cursor-pointer"
                            >
                              {isHidden ? (
                                <Lock className="size-4.5" />
                              ) : (
                                <LockOpen className="size-4.5" />
                              )}
                            </button>
                          </Tooltip>
                          <Tooltip content="Remove test case">
                            <button
                              type="button"
                              onClick={() => removeCase(id)}
                              className="text-monaco-muted hover:text-monaco-txt transition-colors cursor-pointer"
                            >
                              <X className="size-6" />
                            </button>
                          </Tooltip>
                        </div>
                      </div>
                    );
                  })}
                  <div className="mt-1 flex justify-center pt-2">
                    <Tooltip content="Add test case">
                      <button
                        type="button"
                        onClick={addCase}
                        className="group flex size-12 cursor-pointer items-center justify-center rounded-xl bg-monaco-mid text-monaco-muted shadow-xl shadow-black/20 transition-colors duration-200 hover:bg-monaco-light hover:text-monaco-txt"
                      >
                        <Plus className="size-6" />
                      </button>
                    </Tooltip>
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
