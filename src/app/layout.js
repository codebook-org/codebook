// to prevent crash due to pre-rendering pages during build
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
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
