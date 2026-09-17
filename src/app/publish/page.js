"use client";

import { useState, useRef } from "react";
import { addProblem, addTestCasedb } from "./actions";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { Group, Panel, Separator } from "react-resizable-panels";
import { toast } from "sonner";
import { MoveRight, Lock, LockOpen, Eraser, Plus, Upload, Blocks, PencilLine, ListPlus, } from "lucide-react";
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
  const [description, setDescription] = useState("");
  const [hiddenCase, setHidden] = useState([]);
  const [minPanelHeight, setMinPanelHeight] = useState(10);

  // stores test cases
  const [testCases, setTestCase] = useState({
    [1]: { input: "", output: "" },
  });

  // stores starter code for respective languages
  const [starterCode, setStarterCode] = useState({
    cpp: "",
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
      <SplitPane
        left={
          <div className="h-full flex flex-col overflow-hidden">
            <div className="flex items-center gap-3 rounded-xl border border-monaco-light bg-monaco-dark p-2 mb-2">
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="flex-1 h-9 rounded-lg bg-black/30 text-monaco-txt font-medium text-lg border-none focus:ring-2 focus:ring-blue-500 focus:outline-none px-2"
              />
              <Confirmation
                title="Are you sure?"
                description="You won't be able to edit this problem once it has been published."
                onConfirm={handleSubmit}
              >
                <button
                  type="submit"
                  className="h-9 px-10 py-2 rounded-lg bg-monaco-mid text-green-500 hover:bg-green-700 hover:text-monaco-txt font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Upload className="size-4.5" strokeWidth={2.5} />
                  Publish
                </button>
              </Confirmation>
            </div>
            <div className="flex-1 min-h-0">
              <Card
                icon={PencilLine}
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
          </div>
        }
        right={
          <Group
            orientation="vertical"
            className="flex flex-col flex-1 min-h-0 overflow-y-auto"
          >
            <Panel
              defaultSize="70%"
              minSize={`${minPanelHeight}px`}
              maxSize="95.35%"
            >
              <Card
                icon={Blocks}
                title="Starter Code"
                tabs={codeTabs}
                activeTab={currentCodeTab}
                onTabChange={setCurrentCodeTab}
                getMinHeight={setMinPanelHeight}
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
            <Separator className="group h-0.5 my-0.75 self-stretch bg-transparent rounded-full hover:bg-blue-500 transition-colors duration-150 cursor-col-resize flex items-center justify-center">
              <div className="h-0.5 w-8 bg-monaco-mid rounded-full group-hover:bg-transparent group-active:bg-transparent transition-colors duration-150" />
            </Separator>
            <Panel
              minSize={`${minPanelHeight}px`}
            >
              <Card
                icon={ListPlus}
                title="Test Cases"
                getMinHeight={setMinPanelHeight}
              >
                <div className="flex flex-col p-1 pb-6 gap-2">
                  {Object.entries(testCases).map(([id, data]) => {
                    const isHidden = hiddenCase.includes(Number(id));
                    return (
                      <div
                        key={id}
                        className={`flex items-center gap-3 px-3 py-2 border rounded-xl transition-colors transition-150 overflow-hidden
                                    ${isHidden ? "bg-transparent border-monaco-light" : "bg-monaco-mid border-transparent"}`}
                      >
                        <Tooltip
                          content={`${isHidden ? "Show test case" : "Hide test case"}`}
                        >
                          <button
                            type="button"
                            onClick={() => updateHidden(id)}
                            className="transition-colors text-monaco-muted hover:text-monaco-txt hover:bg-monaco-light rounded-lg p-1.5 cursor-pointer"
                          >
                            {isHidden ? (
                              <Lock className="size-4.5" />
                            ) : (
                              <LockOpen className="size-4.5" />
                            )}
                          </button>
                        </Tooltip>
                        <span className="text-sm font-medium text-monaco-txt whitespace-nowrap mr-1 shrink-0">
                          Test case {id}
                        </span>
                        <div className="flex flex-1 items-center min-w-0 gap-3">
                          <input
                            className="flex-1 min-w-0 bg-neutral-900/80 px-3 py-2 font-mono rounded-lg text-xs text-monaco-txt focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Input"
                            value={data.input}
                            onChange={(e) =>
                              updateCase(id, "input", e.target.value)
                            }
                          />
                          <MoveRight className="size-4.5 text-monaco-muted" />
                          <input
                            className="flex-1 min-w-0 bg-neutral-900/80 px-3 py-2 font-mono rounded-lg text-xs text-monaco-txt focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Expected Output"
                            value={data.output}
                            onChange={(e) =>
                              updateCase(id, "output", e.target.value)
                            }
                          />
                          <Tooltip content="Remove test case">
                            <button
                              type="button"
                              onClick={() => removeCase(id)}
                              className="text-monaco-muted hover:text-monaco-txt transition-colors cursor-pointer hover:bg-monaco-light rounded-lg p-1.5 cursor-pointer"
                            >
                              <Eraser className="size-4.5" />
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
                        className="group flex size-12 cursor-pointer items-center justify-center rounded-xl bg-monaco-mid text-monaco-muted transition-colors duration-200 hover:bg-monaco-light hover:text-monaco-txt"
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
