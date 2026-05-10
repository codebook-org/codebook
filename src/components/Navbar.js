"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SignIn from "@/components/SignIn"

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/publish", label: "Publish" },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="nav">
      <Link href="/" className="logo">
        CodeBook
      </Link>
      <ul className="nav-links">
        {NAV_LINKS.map(({ href, label }) => (
          <li key={href}>
            <Link href={href} className={pathname === href ? "active" : ""}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
      <SignIn></SignIn>
    </nav>
  );
}
