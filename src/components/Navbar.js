"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import Tooltip from "@/components/Tooltip";
import UserMenu from "@/components/logincomponents/UserMenu";
import {
  Home,
  Info,
  CircleQuestionMark,
  CodeXml,
  PencilLine,
  Settings,
} from "lucide-react";
import { useSession } from "next-auth/react";

// general links for navigating codebook
const NAV_LINKS_LEFT = [
  { href: "/", label: "Home", icon: Home, isExternal: false },
  { href: "/about", label: "About", icon: Info, isExternal: false },
  {
    href: "/guide",
    label: "Guide",
    icon: CircleQuestionMark,
    isExternal: false,
  },
  {
    href: "https://github.com/codebook-org/codebook",
    label: "GitHub",
    icon: CodeXml,
    isExternal: true,
  },
];

// additional links that require a user to be logged in
const NAV_LINKS_RIGHT = [
  { href: "/publish", label: "Publish", icon: PencilLine, isExternal: false },
  { href: "/settings", label: "Settings", icon: Settings, isExternal: false },
];

export default function Navbar() {
  const { data: session, status, update } = useSession();

  return (
    <nav className="flex items-center justify-between p-4 sticky top-0 bg-background z-[100] overflow-visible h-16">
      <div className="flex items-center gap-4">
        <Link href="/" className="logo flex items-center">
          <Logo className="mx-2" color="text-monaco-txt" />
          <div className="text-monaco-txt font-mono">codebook</div>
        </Link>
        <div className="w-[1px] h-4 bg-monaco-light mx-2" />
        <ul className="flex items-center gap-2 -ml-2">
          {NAV_LINKS_LEFT.map(({ href, label, icon: Icon, isExternal }) => (
            <li key={href}>
              <Tooltip content={label}>
                <Link
                  href={href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                >
                  <div className="group border-monaco-light p-2 transition-colors rounded-lg hover:bg-monaco-mid">
                    <Icon className="size-4.5 text-monaco-muted group-hover:text-monaco-txt" />
                  </div>
                </Link>
              </Tooltip>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center gap-4 mr-2">
        {status === "unauthenticated" ? (
          <Link href="/login">
            <div className="border-1 border-monaco-mid p-2 px-6 text-sm text-monaco-muted transition-colors rounded-lg hover:text-monaco-txt hover:bg-monaco-mid">
              Sign in
            </div>
          </Link>
        ) : (
          <div className="flex items-center">
            <ul className="flex items-center gap-2 mr-2">
              {NAV_LINKS_RIGHT.map(
                ({ href, label, icon: Icon, isExternal }) => (
                  <li key={href}>
                    <Tooltip content={label}>
                      <Link
                        href={href}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                      >
                        <div className=" group border-monaco-light p-2 transition-colors rounded-lg hover:bg-monaco-mid">
                          <Icon className="size-4.5 text-monaco-muted group-hover:text-monaco-txt" />
                        </div>
                      </Link>
                    </Tooltip>
                  </li>
                ),
              )}
            </ul>
            <div className="w-[1px] h-4 bg-monaco-light mx-2" />
          </div>
        )}
        <UserMenu key={status} />
      </div>
    </nav>
  );
}
