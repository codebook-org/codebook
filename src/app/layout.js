import "./global.css";
import Navbar from "@/components/Navbar";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "CodeBook",
  description: "Practice coding problems with your team.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-monaco-dark text-monaco-txt">
        <SessionProvider refetchOnWindowFocus={true} refetchWhenOffline={false}>
          <Navbar />
          <main>{children}</main>
        </SessionProvider>
<Toaster 
  position="top-center" 
  expand={false}
  toastOptions={{
    unstyled: true,
    classNames: {
      toast: 'group toast !bg-monaco-dark !border !border-monaco-light !text-monaco-txt rounded-3xl shadow-xl shadow-black/25 flex items-center gap-2 p-4',
      title: 'text-xs font-medium text-monaco-txt',
      description: 'text-xs text-monaco-txt',
      error: '[&_[data-icon]]:text-red-500', 
      success: '[&_[data-icon]]:text-green-500',
    },
  }}
/>
      </body>
    </html>
  );
}

