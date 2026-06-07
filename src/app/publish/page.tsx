"use client"; // This must be at the very top to allow hooks like useState

import { useState } from "react";
import { problems } from "@/lib/data";
import { addProblem, addTestCasedb } from "./actions";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Group, Panel, Separator } from "react-resizable-panels";
import { toast } from "sonner";
import SplitPane from "@/components/SplitPane";
import Card from "@/components/Card";

export default function Publish() {
  const { data: session } = useSession();
  const [title, setTitle] = useState(""); 
  const [description, setDescription] = useState(""); 
  const [id, setCount] = useState(2);
  const [hiddenCase, setHidden] = useState([1]);

  // stores test cases
  const [testCases, setTestCase] = useState({
    [1]: { input: "", output: "" },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tTitle = title.trim();
    const tDescription = description.trim();

    if (tTitle == "" || tDescription == "") {
      if (tTitle == "" && tDescription == "") {
        toast.error("You're missing a title and description");
      } else if (tTitle == "") {
        toast.error("You're missing a title");
      } else {
        toast.error("You're missing a description");
      }

      return;
    } else {
      const result = verifyTestCases();

      if (result == "success") {
        let probData = await addProblem(tTitle, tDescription, session.user.id); // Actually add to the SQL database.
        addAllTestCases(probData);
        toast.success("Problem published!");
        return;
      } else {
        toast.error(result);
      }
    }
  };

  // add a test case
  const addCase = (e) => {
    e.preventDefault();
    if (e) e.preventDefault();

    setTestCase((prev) => ({
      // We're essentially saying "Hey, take the previous inputs, and tack on this new one."
      ...prev,
      [id]: { input: "", output: "" }, // Keep it blank. This is also how we check if an entry is empty.
    }));

    setHidden((prev) => [...prev, id]);
    setCount((prevCount) => prevCount + 1);
  };

  // remove a test case
  const removeCase = (e) => {
    e.preventDefault();
    if (e) e.preventDefault();

    // Check if there's 1 case, you must submit minimum 1 case.
    if (id <= 2) {
      // Since we use id like "nextID", we know that there's only one case if our "Next ID" is 2.
      console.log("CANNOT REMOVE");
    } else {
      setTestCase((prev) => {
        const newState = { ...prev }; // Take the old dictionary..
        delete newState[id - 1]; // Remove the last id
        return newState; // Now set the dictionary to this new, removed-case dictionary.
      });

      setHidden((prev) => prev.filter((item) => item !== id - 1));

      setCount((prevCount) => prevCount - 1);
    }
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
    // Need to convert because this id is a string, oddly enough.
    const targetId = Number(id);

    setHidden((prev) => {
      if (prev.includes(targetId)) {
        // If it is in the "HIDDEN" list...
        return prev.filter((item) => item !== targetId); // Remove it.
      } else {
        return [...prev, targetId]; // Else, we can add it to our list.
      }
    });
  };

  const testExport = (e) => {
    e.preventDefault();
    // Need to convert because this id is a string, oddly enough.
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
      <div className="flex items-center rounded-lg bg-monaco-dark p-3 mb-2 h-14">
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full h-full rounded-lg bg-neutral-900 text-monaco-txt font-semibold text-xl border-none p-3"
        />
        <button 
          type="submit" 
          onClick={handleSubmit}
          className="cursor-pointer text-sm font-bold h-full px-32 ml-2 rounded-lg bg-monaco-mid text-green-500 hover:bg-green-700 hover:text-monaco-txt transition-colors"
        >
          Publish
        </button>
      </div>
      <Group
        orientation="vertical"
        className="flex flex-col flex-1 min-h-0 overflow-y-auto"
      >
        <Panel
          defaultSize="65%"
          minSize="35%"
          maxSize="65%"
        >
          
          <SplitPane
            left={
              <div className="h-full overflow-y-auto">
                <Card title="Description">
                  <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="description" style={{ display: "block" }}>
                      Description:
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Description"
                      style={{
                        padding: "0.5rem",
                        width: "100%",
                        height: "200px",
                        borderWidth: "1px",
                        resize: "none",
                        textWrap: "wrap",
                        whiteSpace: "pre-wrap",
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                      }}
                    />
                  </div>
                </Card>
              </div>
            }
            right={
              <Card title="Starter Code">
                hello
              </Card>
            }
            layout="standard"
          />
        </Panel>
        
        <Separator className="group h-0.5 my-0.75 self-stretch bg-transparent rounded-full hover:bg-monaco-muted active:bg-blue-500 transition-colors duration-150 cursor-col-resize flex items-center justify-center">
          <div className="h-0.5 w-8 bg-monaco-mid rounded-full group-hover:bg-transparent group-active:bg-transparent transition-colors duration-150" />
        </Separator>
        
        <Panel>
          <Card title="Test Cases">
          <div>
            <div className="flex items-center p-2 justify-between">
              <div className="right flex items-center p-2">
                <form onSubmit={addCase}>
                  <div className="p-1 border rounded w-[35px] place-items-center center">
                    <button style={{ cursor: "pointer", textAlign: "center" }}>
                      +
                    </button>
                  </div>
                </form>

                <form onSubmit={removeCase}>
                  <div className="p-1">
                    <button style={{ cursor: "pointer" }}>-</button>
                  </div>
                </form>
              </div>
            </div>
            
            <div className="flex flex-col border rounded overflow-y-auto h-[400px] p-2 mb-2">
              {Object.entries(testCases).map(([id, data]) => (
                <div
                  key={id}
                  className="flex items-center gap-3 p-3 border rounded shadow-sm mb-2"
                >
                  <span className="text-sm font-bold whitespace-nowrap">
                    Case {id}:
                  </span>

                  <div className="flex flex-1 items-center gap-3">
                    <input
                      className="flex-1 min-w-0 border p-1.5 rounded text-sm focus:ring-1 focus:outline-none"
                      placeholder="Input"
                      value={data.input}
                      onChange={(e) => updateCase(id, "input", e.target.value)}
                    />

                    <span className="text-gray-400 font-bold">→</span>

                    <input
                      className="flex-1 min-w-0 border p-1.5 rounded text-sm focus:ring-1 focus:outline-none"
                      placeholder="Output"
                      value={data.output}
                      onChange={(e) => updateCase(id, "output", e.target.value)}
                    />

                    <button
                      onClick={(e) => updateHidden(id)}
                      style={{
                        backgroundColor: hiddenCase.includes(Number(id))
                          ? "#ef4444"
                          : "#22c55e",
                        padding: "10px 20px",
                        cursor: "pointer",
                      }}
                    >
                      {hiddenCase.includes(Number(id)) ? "🤫" : "📣"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </Card>
        </Panel>
      </Group>
    </div>
  );
}
