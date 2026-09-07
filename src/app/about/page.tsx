import Link from "next/link";
import { Info, Astroid, Bug } from "lucide-react";

export default async function AboutPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] flex flex-col justify-center max-w-3xl mx-auto py-6 text-left">
      <section className="font-mono p-6 backdrop-blur-sm">
        <h1 className="text-monaco-txt flex items-center font-semibold mb-2">
          <Info className="size-5 mr-2 text-monaco-muted" />
          About
        </h1>
        <p className="text-sm text-monaco-txt leading-relaxed">
          codebook is a platform for hosting custom LeetCode-style programming
          problems. It is designed to make sharing coding challenges convenient
          and fun. If you love competitive programming, algorithmic puzzles, or
          just building clever challenges, you'll feel right at home here.
        </p>
      </section>
      <section className="font-mono p-6 backdrop-blur-sm">
        <h1 className="text-monaco-txt flex items-center font-semibold mb-2">
          <Astroid className="size-5 mr-2 text-monaco-muted" />
          Features
        </h1>
        <p className="text-sm text-monaco-txt leading-relaxed mt-4">
          Create custom problems using codebook's feature-rich problem editor.
          Then, publish them directly to your profile to grow your very own
          repository of programming challenges.
        </p>
        <p className="text-sm text-monaco-txt leading-relaxed mt-4">
          Challenging your friends is as easy as sending a link. codebook
          provides a convenient in-browser code editing experience, handles
          remote code execution, and evaluates the correctness of solutions.
        </p>
        <p className="text-sm text-monaco-txt leading-relaxed mt-4">
          For a more in-depth look into codebook's features and a walkthrough on
          getting started, check out our{" "}
          <Link
            href="/guide"
            className="bg-yellow-700/25 hover:bg-yellow-700/35 text-yellow-600 transition-colors px-1.5 py-0.5 inline-block rounded-md font-medium alignment-baseline"
          >
            guide
          </Link>
          .
        </p>
      </section>
      <section className="font-mono p-6 backdrop-blur-sm">
        <h1 className="text-monaco-txt flex items-center font-semibold mb-2">
          <Bug className="size-5 mr-2 text-monaco-muted" />
          Bug report
        </h1>
        <p className="text-sm text-monaco-txt leading-relaxed mt-4">
          Found a bug? Drop us a line over on{" "}
          <Link
            href="https://github.com/codebook-org/codebook"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-yellow-700/25 hover:bg-yellow-700/35 text-yellow-600 transition-colors px-1.5 py-0.5 inline-block rounded-md font-medium alignment-baseline"
          >
            GitHub
          </Link>
          .
        </p>
      </section>
      <footer className="font-mono text-center text-xs text-monaco-light mt-auto pt-8">
        Made with love by a group of friends from the University of Washington.
      </footer>
    </main>
  );
}
