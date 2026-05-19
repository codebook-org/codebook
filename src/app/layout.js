export const dynamic = "force-dynamic";

import Navbar from "@/components/Navbar";
import { SessionProvider } from "next-auth/react"; // I need to stop putting SessionProvider everywhere LMAO

import "./global.css";
import { Session } from "node:inspector";

export const metadata = {
  title: "CodeBook",
  description: "Practice coding problems with your team.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-monaco-dark text-monaco-txt">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
