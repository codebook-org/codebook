"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import Tooltip from "@/components/Tooltip";
import UserMenu from "@/components/logincomponents/UserMenu";
import { Home, Info, CircleQuestionMark, CodeXml, PencilLine } from "lucide-react";
import { useSession } from "next-auth/react";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: Home, isExternal: false },
  { href: "/about", label: "About", icon: Info, isExternal: false },
  { href: "/guide", label: "Guide", icon: CircleQuestionMark, isExternal: false },
  { href: "https://github.com/codebook-org/codebook", label: "GitHub", icon: CodeXml, isExternal: true },
  { href: "/publish", label: "Publish", icon: PencilLine, isExternal: false },
  // { href: "/login", label: "Login" },
];

export default function Navbar() {
  const { data: session, status, update } = useSession();

  const visibleLinks = NAV_LINKS.filter((link) => {
    if (status == "authenticated" && link.href == "/login") {
      return false;
    }

    if (
      status == "unauthenticated" &&
      (link.href == "/profile" || link.href == "/publish")
    ) {
      return false;
    }

    return true;
  });

  return (
    <nav className="flex items-center justify-between p-4 sticky top-0 bg-background z-[100] overflow-visible h-16">
      <div className="flex items-center gap-6">
        <Link href="/" className="logo flex items-center">
          <Logo className="mx-2" />
          codebook
        </Link>
        <div className="w-[1px] h-4 bg-monaco-muted mx-2" />
        <div className="flex items-center gap-3">
          <ul className="flex items-center gap-3">
            {visibleLinks.map(({ href, label, icon: Icon, isExternal }) => (
              <li key={href}>
                <Tooltip content={label}>
                  <Link
                    href={href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                  >
                    <div className="group border-1 border-monaco-muted p-2 rounded-lg hover:bg-monaco-mid hover:border-monaco-txt">
                      <Icon className="size-4 text-monaco-muted group-hover:text-white transition-colors" />
                    </div>
                  </Link>
                </Tooltip>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <UserMenu key={status} />
    </nav>
  );
}
