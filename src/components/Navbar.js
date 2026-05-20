"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import UserMenu from "@/components/logincomponents/UserMenu";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/problems-library", label: "Browse Problems" },
  { href: "/publish", label: "Publish" },
  { href: "/login", label: "Login" }, // Likely temporary, I have to figure out a way to fix this.
];

export default function Navbar() {
  const pathname = usePathname();

  const { data: session, status, update } = useSession();

  // Uncomment this if you're having issues with seeing current status (unauth, auth, etc.)
  // console.log("NAVBAR RENDER:", { status, hasUser: !!session?.user });

  const visibleLinks = NAV_LINKS.filter((link) => {
    // If the user is logged in, don't show the Login link
    if (status == "authenticated" && link.href == "/login") {
      return false;
    }

    // If the user isn't logged in, let's be safe and not let them see the publish page.
    if (
      status == "unauthenticated" &&
      (link.href == "/profile" || link.href == "/publish")
    ) {
      return false;
    }

    return true;
  });

  return (
    <nav className="nav h-18">
      <Link href="/" className="logo">
        codebook
      </Link>
      <ul className="nav-links">
        {visibleLinks.map(({ href, label }) => (
          <li key={href}>
            <Link href={href} className={pathname === href ? "active" : ""}>
              {label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Moved Session Provider out to the Layout, so everything will obtain acces to SessionProvider. */}
      <UserMenu key={status} />
    </nav>
  );
}
