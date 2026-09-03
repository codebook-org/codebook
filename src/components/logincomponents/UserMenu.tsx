"use client";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { UserRound, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Tooltip from "@/components/Tooltip";

import Image from "next/image"; // Required for Next.js image.

export default function UserMenu() {
  const { data: session, status } = useSession();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // return null if not logged in
  if (status !== "authenticated" || !session?.user) return null;

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <Tooltip content="Open user navigation menu">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group flex cursor-pointer items-center gap-3 bg-transparent p-0 border-0 focus:outline-none"
        >
          <div className="h-8 w-8 rounded-full border border-zinc-700 bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold text-xs">
            {session.user.displayName?.charAt(0).toUpperCase() ||
              session.user.username?.charAt(0).toUpperCase() ||
              "?"}
          </div>
          <div className="text-xs text-monaco-muted group-hover:text-monaco-txt">
            {session.user.displayName || session.user.username || "?"}
          </div>
        </button>
      </Tooltip>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="user-dropdown"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 0 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className="w-full"
          >
            <div className="absolute right-0 top-full mt-2 p-2 w-56 z-[9999] bg-monaco-dark border border-monaco-light shadow-xl shadow-black/40 rounded-2xl overflow-hidden">
              <div className="flex items-center pb-2">
                <div className="h-12 w-12 shrink-0 rounded-full border border-zinc-700 bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold">
                  {session.user.displayName?.charAt(0).toUpperCase() ||
                    session.user.username?.charAt(0).toUpperCase() ||
                    "?"}
                </div>
                <div className="flex flex-col ml-3 min-w-0">
                  <span className="font-bold text-monaco-txt text-xs truncate">
                    {session.user.displayName ||
                      session.user.username ||
                      session.user.name ||
                      ""}
                  </span>
                  <span className="text-xs text-monaco-muted truncate">
                    {session.user.email}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-0.5">
                <Link
                  href={`/profile/${session?.user?.id}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center w-full px-3 py-2.5 text-xs text-monaco-txt rounded-lg hover:bg-monaco-mid transition"
                >
                  <UserRound className="size-4 text-monaco-muted mr-2 shrink-0" />
                  Profile
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center w-full px-3 py-2 text-xs text-zinc-300 rounded-lg hover:bg-zinc-800 transition"
                >
                  Settings
                </Link>
              </div>
              <div className="pt-1 mt-1 border-t border-monaco-light">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-red-400 rounded-lg hover:bg-red-950/30 transition font-medium"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
