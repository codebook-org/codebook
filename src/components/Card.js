export default function Card({
  title,
  optionsLeft,
  optionsRight,
  children,
  statusBar,
  className = "",
}) {
  return (
    <div
      className={`bg-monaco-dark rounded-lg h-full overflow-hidden flex flex-col ${className}`}
    >
      <div className="bg-monaco-mid text-sm px-4 py-1.5 shrink-0">
        <h1 className="text-monaco-txt">{title || "Card Header"}</h1>
      </div>
      {(optionsLeft || optionsRight) && (
        <div className="border-b border-monaco-mid px-4 py-1.5 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2">{optionsLeft}</div>
          <div className="flex items-center gap-2 ml-auto">{optionsRight}</div>
        </div>
      )}
      <div className="p-4 flex-1 min-h-0 overflow-y-auto">{children}</div>
      {statusBar && <div className="pb-6">{statusBar}</div>}
    </div>
  );
}
