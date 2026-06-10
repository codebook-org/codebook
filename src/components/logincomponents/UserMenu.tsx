"use client";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

import Image from "next/image"; // Required for Next.js image.

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

  // For now, this says if you're not logged in, don't display the dropdown.
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
        {session.user.image ? (
          <Image
            className="h-14 w-14 rounded-full mb-2 border border-zinc-700 object-cover"
            src={session.user.image}
            alt="Profile"
            width={56}
            height={56}
          />
        ) : (
          <div className="h-14 w-14 rounded-full mb-2 border border-zinc-700 bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold">
            {session.user.name?.charAt(0).toUpperCase() || "U"}
          </div>
        )}
      </button>

      {/* When our state is  "OPEN" (aka, we opened the dropdown,) */}

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 z-[9999] bg-[#111] border border-zinc-800 shadow-2xl rounded-lg overflow-hidden">
          <div className="flex flex-col items-center p-4 border-b border-zinc-800">
            {session.user.image ? (
              <Image
                className="h-14 w-14 rounded-full mb-2 border border-zinc-700 object-cover"
                src={session.user.image}
                alt="Profile"
                width={56}
                height={56}
              />
            ) : (
              <div className="h-14 w-14 rounded-full mb-2 border border-zinc-700 bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold">
                {session.user.displayName?.charAt(0).toUpperCase() ||
                  session.user.username?.charAt(0).toUpperCase() ||
                  "?"}
              </div>
            )}
            {/* Grab all user information .. */}
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
            <span className="text-xs text-zinc-400 truncate w-full text-center">
              {session.user.id}
            </span>
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
      )}
    </div>
  );
}
