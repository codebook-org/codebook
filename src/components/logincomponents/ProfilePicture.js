"use client";

import { useSession } from "next-auth/react";

export default function UserAvatar() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;
  if (!session?.user) return null;

  return (
    <div>
      <img src={session.user.image} alt="User Avatar" />
    </div>
  );
}
