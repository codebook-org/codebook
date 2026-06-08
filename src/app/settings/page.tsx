"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Settings() {
    const { data: session, status } = useSession();

    const bio = await 

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
            <textarea placeholder={}/>
        </main>
    );

}