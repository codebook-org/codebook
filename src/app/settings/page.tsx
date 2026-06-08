"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { getBio } from "./actions"

export default function Settings() {
    const { data: session, status } = useSession();
    const [bio, setBio] = useState<string>(""); // State to hold the fetched bio

    useEffect(() => {
        // Only fetch when the session is completely loaded and the user exists
        if (status === "authenticated" && session?.user?.id) {
            getBio(session.user.id).then((fetchedBio) => {
                setBio(fetchedBio || ""); // Update state once the promise resolves
            });
        }
    }, [session, status]);

    if (status == "loading") {
        return <main style={{ padding: "2rem" }}><h1>Loading...</h1></main>;
    }

    // We can't check settings if we're not logged in, so let's redirect to login.
    if (!session?.user) {
        redirect("/login");
    }
    return (
        <main style={{ padding: "2rem" }}>
            <h1>TBA</h1>
            <input placeholder={session.user.displayName}/>
            <textarea placeholder={bio ?? "Tell us about yourself..."}/>
        </main>
    );

}