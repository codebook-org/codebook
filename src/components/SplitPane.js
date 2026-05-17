"use client";
import { Group, Panel, Separator } from "react-resizable-panels";

export default function SplitPane({ left, right, layout = "standard" }) {
  const sizes = {
    standard: { left: "33.3%", right: "66.6%" },
    reverse: { left: "66.6%", right: "33.3%" },
    equal: { left: "50%", right: "50%" },
  };

  const initialSizes = sizes[layout] || sizes.standard;

  return (
    <Group orientation="horizontal" className="w-screen h-screen">
      <Panel defaultSize={initialSizes.left} minSize="20%" maxSize="80%">
        <div className="h-full pr-0.5">{left}</div>
      </Panel>
      <Separator className="w-1 self-stretch bg-transparent hover:bg-monaco-muted active:bg-blue-500 transition-colors duration-150 cursor-col-resize rounded" />
      <Panel defaultSize={initialSizes.right} minSize="25%" maxSize="80%">
        <div className="h-full pl-0.5">{right}</div>
      </Panel>
    </Group>
  );
}
