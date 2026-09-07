import Link from "next/link";
import { Info } from "lucide-react";

export default async function AboutPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] flex flex-col justify-center max-w-3xl mx-auto px-6 py-16 text-left">
      <section className="-mt-48 mb-8 font-mono bg-background border border-background rounded-3xl p-8 md:p-8 shadow-black/25 backdrop-blur-sm">
        <h1 className="text-monaco-txt flex items-center font-mono font-semibold mb-4">
          <Info className="size-5 mr-3 mb-0.5 text-monaco-muted" />
          About
        </h1>
        <p className="text-sm text-monaco-txt leading-relaxed">
          codebook is a platform for hosting custom LeetCode-style programming problems. It is designed
          to make sharing coding challenges convenient and fun.
        </p>
        <p className="text-sm text-monaco-txt leading-relaxed mt-4">
          Create custom problems using codebook's feature-rich problem editor.
          Then, publish them directly to your profile to grow your very own repository of programming challenges.
        </p>
        <p className="text-sm text-monaco-txt leading-relaxed mt-4">
          Challenging your friends is as easy as sending a link. codebook provides a convenient in-browser code editing experience, handles
          remote code execution, and evaluates the correctness of solutions.
        </p>
        <p className="text-sm text-monaco-txt leading-relaxed mt-4">
          Check out our
          {
            <Link href="/guide">
              <button className="bg-yellow-700/25 hover:bg-yellow-700/40 cursor-pointer text-yellow-600 transition-colors px-1 py-1 mx-1 -mt-2 rounded-lg">

                guide
              </button>
            </Link>
          }
          to get started.
        </p>
      </section>
    </main>
  );
}
