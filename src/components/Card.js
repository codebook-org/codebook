import { useRef, useLayoutEffect } from "react";

export default function Card({
  id,
  icon: Icon,
  title,
  getMinHeight,
  tabs,
  activeTab,
  onTabChange,
  optionsLeft,
  optionsRight,
  optionsBottom,
  children,
  statusBar,
  className = "",
}) {
  const headerRef = useRef(null);

  useLayoutEffect(() => {
    if (headerRef.current) {
      const height = headerRef.current.offsetHeight;

      if (getMinHeight) {
        getMinHeight(height);
      }
    }
  }, []);

  return (
    <div
      id={id}
      className={`bg-monaco-dark rounded-xl h-full overflow-hidden flex flex-col outline-1 outline-monaco-light outline-offset-[-1px] ${className}`}
      tabIndex="0"
    >
      <div
        ref={headerRef}
        className="flex items-center bg-monaco-dark text-sm font-semibold px-3 py-3 shrink-0"
      >
        {Icon && <Icon className="size-4.5 text-monaco-txt mr-2" />}
        <h1 className="text-monaco-txt">{title || "Card Header"}</h1>
      </div>
      {tabs && tabs.length > 0 && (
        <div className="bg-monaco-dark border-b border-monaco-light flex items-center px-2 shrink-0">
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
                      ? "text-monaco-txt border-t border-l border-r rounded-t-lg border-monaco-light bg-monaco-dark font-semibold -mb-px"
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
        <div className="px-2 flex mb-0.5 items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2">{optionsLeft}</div>
          <div className="flex items-center gap-2 ml-auto">{optionsRight}</div>
        </div>
      )}
      <div className="pt-4 px-4 flex-1 min-h-0 overflow-y-auto">{children}</div>
      {statusBar && <div className="pb-6">{statusBar}</div>}
      {optionsBottom && (
        <div className="p-2 flex items-center shrink-0">
          <div className="flex items-center w-full gap-2">{optionsBottom}</div>
        </div>
      )}
    </div>
  );
}
