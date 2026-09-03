"use client";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { UserRound, Settings, LogOut, Notebook, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Tooltip from "@/components/Tooltip";

export default function UserMenu() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const MENU_LINKS = [
    { href: `/profile/${session?.user?.id}`, label: "Profile", icon: UserRound },
    { href: "/myproblems", label: "My problems", icon: Notebook },
    { href: "/favorites", label: "Favorites", icon: Heart },
    { href: "/settings", label: "User settings", icon: Settings },
  ];

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
                {MENU_LINKS.map(({ href, label, icon: Icon }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center w-full px-3 py-2.5 text-xs text-monaco-txt rounded-lg hover:bg-monaco-mid transition-colors"
                    >
                      <Icon className="size-4 text-monaco-muted mr-2 shrink-0" />
                      {label}
                    </Link>
                  </li>
                ))}
              </div>
              <div className="pt-1 mt-1 border-t border-monaco-light">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="flex items-center w-full text-left px-3 py-2.5 text-xs cursor-pointer text-red-400 rounded-lg hover:bg-red-950/30 transition-colors font-medium"
                >
                  <LogOut className="size-4 text-red-400/70 mr-2" />
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
