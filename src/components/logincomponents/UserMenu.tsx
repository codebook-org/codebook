"use client";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function UserMenu() {
  const { data: session, status } = useSession();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Had Gemini help me out with some of the code.
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

  // I'll add an implementation. For now, this says if you're not logged in, don't display the dropdown.
  if (status !== "authenticated" || !session?.user) return null;

  // This is the dropdown, as of right now.
  return (
    <div
      className="relative"
      ref={dropdownRef}
      style={{ display: "inline-block" }}
    >
      {/* This is the icon turned button. */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex focus:outline-none"
        style={{ background: "none", border: "none", padding: 0 }}
      >
        <img
          className="h-10 w-10 rounded-full border border-zinc-700 object-cover"
          src={session.user.image || ""}
          alt="User Avatar"
        />
      </button>

      {/* When our state is  "OPEN" (aka, we opened the dropdown,) */}

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 z-[9999] bg-[#111] border border-zinc-800 shadow-2xl rounded-lg overflow-hidden">
          <div className="flex flex-col items-center p-4 border-b border-zinc-800">
            <img
              className="h-14 w-14 rounded-full mb-2 border border-zinc-700"
              src={session.user.image || ""}
              alt="Profile"
            />
            {/* Grab all user information .. */}
            <span className="text-xs text-zinc-500">Signed in as</span>
            <span className="font-bold text-white text-sm">
              {session.user.name}
            </span>
            <span className="text-xs text-zinc-400 truncate w-full text-center">
              {session.user.email}
            </span>
            <span>{session.user.id}</span> {/* Troubleshoot */}
          </div>

          <div className="p-1">
            <button className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition">
              Settings [TBA]
            </button>

            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition"
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
      )}
    </div>
  );
}
