"use client";

import { CircleCheck, Ellipsis } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { deleteProblemAction } from "@/lib/problem-actions";
import { useRouter } from "next/navigation";
import Tooltip from "@/components/Tooltip";

export default function ProblemListItem({
  problem,
  isSolved,
  showMoreOptions,
}) {
  const router = useRouter();
  const [moreOptionsIsOpen, setMoreOptionsIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMoreOptionsIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      onClick={() => router.push(`/solve/${problem.problemId}`)}
      className={`flex items-center h-12 p-3 bg-monaco-mid/40 border border-monaco-light rounded-xl text-sm transition-colors cursor-pointer ${
        moreOptionsIsOpen ? "" : "hover:bg-monaco-mid/70"
      }`}
    >
      <span className="text text-monaco-txt py-1.5">{problem.title}</span>

      <div className="flex items-center ml-auto gap-3">
        {isSolved && (
          <div className="flex items-center text-green-500">
            <CircleCheck className="size-4.5 mr-1" />
            <span className="text-xs">Solved!</span>
          </div>
        )}
        {showMoreOptions && (
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <Tooltip content="More options">
              <button
                className="p-1.5 rounded-lg hover:bg-monaco-light cursor-pointer"
                ref={dropdownRef}
                onClick={() => setMoreOptionsIsOpen(!moreOptionsIsOpen)}
              >
                <Ellipsis className="size-4.5 text-monaco-muted" />
              </button>
            </Tooltip>
            <AnimatePresence>
              {moreOptionsIsOpen && (
                <motion.div
                  key="user-dropdown"
                  initial={{ opacity: 0, y: -15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 0 }}
                  transition={{ duration: 0.15, ease: "easeInOut" }}
                  className="absolute right-0 top-full z-[9999]"
                >
                  <div className="w-48 bg-monaco-dark border p-2 border-monaco-light rounded-2xl shadow-xl shadow-black/30 overflow-hidden mt-1">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={async () => {
                          await deleteProblemAction(problem.problemId);
                        }}
                        className="w-full text-red-400 hover:bg-red-400/10 text-left px-3 rounded-lg py-2.5 text-xs font-medium transition-colors duration-150 capitalize cursor-pointer"
                      >
                        Delete problem
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
