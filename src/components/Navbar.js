"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import AuthManager from "@/components/logincomponents/AuthManager";
import SignIn from "@/components/logincomponents/SignIn";
import SignOut from "@/components/logincomponents/SignOut";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/problems-library", label: "Browse Problems" },
  { href: "/publish", label: "Publish" },
  { href: "/profile", label: "Account" },
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
      <AuthManager></AuthManager>
    </nav>
  );
}
