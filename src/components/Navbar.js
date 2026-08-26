"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import Tooltip from "@/components/Tooltip";
import UserMenu from "@/components/logincomponents/UserMenu";
import { Home, Info, CircleQuestionMark, CodeXml, PencilLine } from "lucide-react";
import { useSession } from "next-auth/react";

const NAV_LINKS_LEFT = [
  { href: "/", label: "Home", icon: Home, isExternal: false },
  { href: "/about", label: "About", icon: Info, isExternal: false },
  { href: "/guide", label: "Guide", icon: CircleQuestionMark, isExternal: false },
  { href: "https://github.com/codebook-org/codebook", label: "GitHub", icon: CodeXml, isExternal: true },
];

const NAV_LINKS_RIGHT = [
  { href: "/publish", label: "Publish", icon: PencilLine, isExternal: false },
];

export default function Navbar() {
  const { data: session, status, update } = useSession();


  return (
    <nav className="flex items-center justify-between p-4 sticky top-0 bg-background z-[100] overflow-visible h-16">
      <div className="flex items-center gap-6">
        <Link href="/" className="logo flex items-center">
          <Logo 
            className="mx-2" 
            color="text-monaco-txt" 
          />
          <div className="text-monaco-txt">codebook</div>
        </Link>
        <div className="w-[1px] h-4 bg-monaco-muted mx-2" />
        <div className="flex items-center gap-3">
          <ul className="flex items-center gap-2">
            {NAV_LINKS_LEFT.map(({ href, label, icon: Icon, isExternal }) => (
              <li key={href}>
                <Tooltip content={label}>
                  <Link
                    href={href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                  >
                    <div className="border-1 border-monaco-light p-2 rounded-lg hover:bg-monaco-dark">
                      <Icon className="size-4 text-monaco-muted" />
                    </div>
                  </Link>
                </Tooltip>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex items-center gap-6">
        {status === "unauthenticated" ? (
          <Link href="/login">
            <div className="border-1 border-monaco-light p-2 px-6 text-sm text-monaco-muted rounded-lg hover:bg-monaco-dark">
              Sign In
            </div>
          </Link>
        ) : (
          <ul className="flex items-center gap-2">
            {NAV_LINKS_RIGHT.map(({ href, label, icon: Icon, isExternal }) => (
              <li key={href}>
                <Tooltip content={label}>
                  <Link
                    href={href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                  >
                    <div className="border-1 border-monaco-light p-2 rounded-lg hover:bg-monaco-dark">
                      <Icon className="size-4 text-monaco-muted" />
                    </div>
                  </Link>
                </Tooltip>
              </li>
            ))}
          </ul>
        )}
      <UserMenu key={status} />
      {session.user.displayName}
      </div>
    </nav>
  );
}
