"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { getUserProfile, changeSettings } from "./actions";
import { useEffect, useState } from "react";
import { Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  const { data: session, status, update } = useSession();
  const [warning, setWarning] = useState({ message: "", type: "" });

  const [displayName, setDisplayName] = useState(
    session?.user?.displayName || "",
  );
  const [username, setUsername] = useState(
    session?.user?.username || session?.user?.name,
  );
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      getUserProfile(session.user.id).then((pulledUser) => {
        if (pulledUser) {
          setBio(pulledUser.bio || "");
          setUsername(pulledUser.username || "");
          setDisplayName(displayName == username ? "" : displayName);
        }
      });
    }
  }, [session, status]);

  // wait for auth to load
  if (status === "loading") {
    return (
      <main className="p-8">
        <h1>Loading...</h1>
      </main>
    );
  }

  // must be logged in to access settings
  if (!session?.user) {
    redirect("/login");
  }

  const grabinfo = async (e) => {
    e.preventDefault();
    if (username == "") {
      // Username cannot be empty. Uhh make a notif here
    } else {
      const actDisplay = displayName.trim() === "" ? username : displayName;

      console.log("Submitting");
      const updatedUser = await changeSettings(username, actDisplay, bio);

      if (updatedUser) {
        await update({
          username: username,
          displayName: actDisplay,
          // We do not need to update bio since it's not attributed to the session :)
        });

        redirect("/profile/" + session.user.id);
      } else {
        setWarning({
          message: "That username is already taken. Try another one!",
          type: "warning",
        });
      }
    }
  };

  return (
    <main
      key={status === "authenticated" ? session.user.id : "loading"}
      className="max-w-2xl mx-auto p-8"
    >
      <div className="flex flex-col gap-4 bg-monaco-dark p-8 rounded-3xl border border-monaco-light">
        <div className="flex items-center mb-3">
          <SettingsIcon className="size-5 mr-3 text-monaco-muted" />
          <h1 className="font-semibold text-monaco-txt">User settings</h1>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs ml-2 text-monaco-muted font-medium">
            Display name
          </label>
          <input
            className="w-full flex-1 min-w-0 bg-neutral-900/80 px-3 py-3 mb-1 rounded-lg text-sm text-monaco-txt focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={displayName}
            placeholder="Call me..."
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs ml-2 text-monaco-muted font-medium">
            Username
          </label>
          <input
            className="w-full flex-1 min-w-0 bg-neutral-900/80 px-3 py-3 mb-1 rounded-lg text-sm text-monaco-txt focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={username || ""}
            placeholder="Username"
            onChange={(e) => {
              const noSpaces = e.target.value.replace(/\s/g, "");
              setUsername(noSpaces);
              setWarning({ message: "", type: "" });
            }}
          />
        </div>
        {warning.message && (
          <div
            className={`text-xs warning ml-2 ${warning.type}`}
            style={{
              color: "#ef4444",
            }}
          >
            {warning.message}
          </div>
        )}
        <div className="flex flex-col gap-1">
          <label className="text-xs ml-2 text-monaco-muted font-medium">
            Bio
          </label>
          <textarea
            className="w-full h-32 bg-neutral-900/80 px-3 py-3 mb-1 rounded-lg text-sm text-monaco-txt resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={bio}
            placeholder="Tell us about yourself..."
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
        <form onSubmit={grabinfo}>
          <button className="w-full mt-2 bg-monaco-mid hover:bg-blue-500 text-monaco-txt font-medium text-sm py-2.5 rounded-lg transition-colors cursor-pointer">
            Save changes
          </button>
        </form>
      </div>
    </main>
  );
}
