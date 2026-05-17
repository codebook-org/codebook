"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import UserMenu from "@/components/logincomponents/UserMenu";
import { SessionProvider } from "next-auth/react";

import { useSession } from "next-auth/react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/problems-library", label: "Browse Problems" },
  { href: "/publish", label: "Publish" },
  { href: "/profile", label: "Account" },
  { href: "/login", label: "Login" }, // Likely temporary, I have to figure out a way to fix this.
];

export default function Navbar() {
  const pathname = usePathname();

  const { status } = useSession();

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
    <nav className="nav">
      <Link href="/" className="logo">
        CodeBook
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
      <UserMenu></UserMenu>
    </nav>
  );
}
