"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookType } from "lucide-react";
import Logo from "@/components/Logo";

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
    <nav className="flex items-center justify-between p-4 sticky top-0 bg-background z-[100] overflow-visible h-12">
      <Link href="/" className="logo flex items-center">
        <Logo className="mr-1" />
        codebook
      </Link>
      <div className="flex items-center gap-3">
        <ul className="nav-links flex justify-end">
          {visibleLinks.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className={pathname === href ? "active" : ""}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <UserMenu key={status} />
      </div>
    </nav>
  );
}
