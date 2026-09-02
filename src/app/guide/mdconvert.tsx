import ReactMarkdown from "react-markdown";
import fs from "fs";
import path from "path";
import rehypeSlug from "rehype-slug";

// Refreshes fetch upon page refresh. Kinda gets around nextJs issue?
export const dynamic = "force-dynamic";

export default function ConvertedGuide() {
  const filePath = path.join(process.cwd(), "src", "app", "guide", "guide.md");
  const markdownContent = fs.readFileSync(filePath, "utf8");

  return (
    <div>
      <main className="min-h-[calc(100vh-4rem)] max-w-2xl mx-auto px-6 py-16 text-left space-y-16">
        <ReactMarkdown
          rehypePlugins={[rehypeSlug]}
          components={{
            h1: ({ id, children }) => (
              <h1
                id={id}
                className="text-monaco-txt font-mono text-2xl font-bold scroll-mt-20 mb-3"
              >
                {`> `} {children}
              </h1>
            ),
            h2: ({ id, children }) => (
              <h2
                id={id}
                className="text-monaco-txt font-mono text-xl font-bold border-b pb-1 scroll-mt-20 mb-2 mt-12"
              >
                {`> `} {children}
              </h2>
            ),
            h3: ({ id, children }) => (
              <h3 id={id} className="font-semibold scroll-mt-20 mt-8 mb-2">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="text-sm opacity-80 leading-relaxed mb-3 mt-2 space-y-3">
                {children}
              </p>
            ),
          }}
        >
          {markdownContent}
        </ReactMarkdown>
      </main>
    </div>
  );
}
