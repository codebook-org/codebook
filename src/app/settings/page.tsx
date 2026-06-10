"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { getBio, changeSettings } from "./actions";
import { useEffect, useState } from "react";

// We'll be using the Profile page as a preview.
import ProfileClient from "@/app/profile/[userId]/ProfileClient";

export default function Settings() {
  const { data: session, status, update } = useSession();

  // Variables
  const [displayName, setDisplayName] = useState(
    session?.user?.displayName ||
      session?.user?.username ||
      session?.user?.name,
  );
  const [username, setUsername] = useState(
    session?.user?.username || session?.user?.name,
  );
  // const [email, setEmail] = useState(""); <-- We can consider changing emails at a later date.
  const [bio, setBio] = useState("");

  console.log("RENDER CYCLE LOG - Current State is:", {
    displayName,
    username,
  });

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      getBio(session.user.id).then((fetchedBio) => {
        setBio(fetchedBio || "");

        setDisplayName(session.user.displayName || session.user.username || "");
        setUsername(session.user.username || "");

        console.log(
          "As of loading, the user's information is: \nDisplay Name: " +
            displayName +
            "\nUsername: " +
            username,
        );
      });
    }
  }, [session, status]);

  // If auth is currently loading, then you shouldn't be kicked out. Let it load first..
  if (status === "loading") {
    return (
      <main className="p-8">
        <h1>Loading...</h1>
      </main>
    );
  }

  // But if you aren't logged in, you can't access settings. Nothing to change if you don't have an account.
  if (!session?.user) {
    redirect("/login");
  }

  // Since we're technically passing through an entire user, we need to create a fake one for now.
  const previewUser = {
    userId: parseInt(session.user.id, 10), // Have to parse the int
    email: session.user.email,
    username: username,
    displayName: displayName,
    bio: bio,
    passwordHash: "", // This is ignored, not important information.
  };

  const grabinfo = async (e) => {
    e.preventDefault();
    if (username == "") {
      // Username cannot be empty. Uhh make a notif here
    } else {
      console.log("Submitting");
      await changeSettings(session.user.id, username, displayName, bio);

      // Tell the session to update itself, now that we have new data.
      // I've verified this works, so once changeSettings is implemented, we should be good to go.
      await update({
        username: username,
        displayName: displayName,
        // We do not need to update bio since it's not attributed to the session :)
      });
    }
  };

  return (
    <main
      key={status === "authenticated" ? session.user.id : "loading"} // Should refresh properly
      className="max-w-6xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-10"
    >
      {/* Change settings here */}
      <div className="flex flex-col gap-4 bg-white/5 p-6 rounded-xl border border-white/10">
        <h1 className="text-xl font-bold text-white mb-2">Account Settings</h1>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400 font-medium">
            Display Name
          </label>
          <input
            className="bg-zinc-800 text-white rounded p-2 text-sm border border-zinc-700 focus:outline-none focus:border-zinc-500"
            value={displayName || ""}
            placeholder="Call me..."
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400 font-medium">Username</label>
          <input
            className="bg-zinc-800 text-white rounded p-2 text-sm border border-zinc-700 focus:outline-none focus:border-zinc-500"
            value={username || ""}
            placeholder="Username.."
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400 font-medium">Bio</label>
          <textarea
            className="bg-zinc-800 text-white rounded p-2 text-sm border border-zinc-700 focus:outline-none focus:border-zinc-500"
            value={bio}
            placeholder="Tell us about yourself..."
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        <form onSubmit={grabinfo}>
          <button className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm py-2 rounded transition-colors">
            Save Changes
          </button>
        </form>
      </div>

      {/* PROFILE PREVIEW */}
      <div className="relative border border-white/10 rounded-xl bg-zinc-950 overflow-hidden">
        <div className="absolute top-3 left-4 text-[10px] uppercase tracking-wider font-bold text-zinc-500 pointer-events-none z-10">
          Preview
        </div>
        <div className="pt-4 opacity-90">
          <ProfileClient
            user={previewUser}
            solvedProblems={[]} // We can just push in nothing since we don't really want to display *everything*.
            publishedProblems={[]}
          />
        </div>
      </div>
    </main>
  );
}
