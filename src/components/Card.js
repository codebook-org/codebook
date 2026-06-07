export default function Card({
  id,
  title,
  tabs,
  activeTab,
  onTabChange,
  optionsLeft,
  optionsRight,
  children,
  statusBar,
  className = "",
}) {
  return (
    <div
      id={id}
      className={`bg-monaco-dark rounded-lg h-full overflow-hidden flex flex-col outline-1 outline-transparent focus-within:outline-monaco-light focus-within:outline-offset-[-1px] ${className}`}
      tabIndex="0"
    >
      <div className="bg-monaco-mid text-sm font-semibold px-4 py-1.5 shrink-0">
        <h1 className="text-monaco-txt">{title || "Card Header"}</h1>
      </div>
      {tabs && tabs.length > 0 && (
        <div className="bg-monaco-dark border-b border-monaco-mid flex items-center px-2 shrink-0">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange && onTabChange(tab.id)}
                className={`px-5 py-3 mt-1 text-xs font-semibold  transition-colors cursor-pointer select-none
                  ${
                    isActive
                      ? "text-monaco-txt border-t border-l border-r rounded-t-lg border-monaco-mid bg-monaco-dark font-semibold -mb-px"
                      : "text-monaco-muted border-t border-l border-r rounded-t-lg border-transparent hover:text-monaco-txt -mb-px"
                  }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      )}
      {(optionsLeft || optionsRight) && (
        <div className="h-8 border-b border-monaco-mid px-4 py-1.5 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2">{optionsLeft}</div>
          <div className="flex items-center gap-2 ml-auto">{optionsRight}</div>
        </div>
      )}
      <div className="pt-4 px-4 flex-1 min-h-0 overflow-y-auto">{children}</div>
      {statusBar && <div className="pb-6">{statusBar}</div>}
    </div>
  );
}
