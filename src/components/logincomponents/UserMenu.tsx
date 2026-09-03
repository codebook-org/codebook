"use client";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
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
    <div
      className="relative"
      ref={dropdownRef}
      style={{ display: "inline-block" }}
    >
      <Tooltip content="Open user navigation menu">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group flex cursor-pointer focus:outline-none items-center gap-3"
          style={{ background: "none", border: "none", padding: 0 }}
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
      <AnimatePresence >
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="w-full"
          >
            <div className="absolute right-0 top-full mt-2 w-64 z-[9999] bg-monaco-dark border border-monaco-light shadow-2xl rounded-2xl overflow-hidden">
              <div className="flex flex-col items-center p-4 border-b border-zinc-800">
                <div className="h-14 w-14 rounded-full mb-2 border border-zinc-700 bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold">
                  {session.user.displayName?.charAt(0).toUpperCase() ||
                    session.user.username?.charAt(0).toUpperCase() ||
                    "?"}
                </div>
                <span className="text-xs text-zinc-500">Signed in as</span>
                <span className="font-bold text-white text-sm">
                  {session.user.displayName ||
                    session.user.username ||
                    session.user.name ||
                    ""}
                </span>
                <span className="text-xs text-zinc-400 truncate w-full text-center">
                  {session.user.email}
                </span>

                {/* Uncomment the ID section if you want to debug with ID. */}

                {/* <span className="text-xs text-zinc-400 truncate w-full text-center">
                  {session.user.id}
                </span> */}
              </div>

              <div className="p-1">
                <Link
                  href={`/settings`}
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition"
                >
                  Settings
                </Link>

                <Link
                  href={`/profile/${session?.user?.id}`}
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition"
                >
                  Profile
                </Link>
              </div>

              <div className="p-1 border-t border-zinc-800">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-950/30 transition font-medium"
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
