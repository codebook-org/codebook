export const dynamic = "force-dynamic";

import Navbar from "@/components/Navbar";
import "./global.css";

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
