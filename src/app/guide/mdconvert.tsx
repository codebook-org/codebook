import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import { guides } from "#site/content";

export const dynamic = "force-dynamic";

class TocItem {
  title: string;
  url: string;
  depth: number;
}

// Our headers are nested into eachother, as items. We need to calculate depth.
function flattenToc(items: any[], depth = 1): TocItem[] {
  return items.flatMap((item) => [
    { title: item.title, url: item.url, depth },
    ...(item.items ? flattenToc(item.items, depth + 1) : []),
  ]);
}

export default function ConvertedGuide() {
  // Guides exports as an array, so we need to grab the information ("first index")
  const guide = guides[0];

  const flatToc = flattenToc(guide.toc);

  return (
    <div className="flex justify-center gap-12 max-w-5xl mx-auto px-6">
      <aside className="text-monaco-txt font-mono text-sm w-40 sticky top-20 self-start space-y-1">
        {flatToc.map((item) => (
          <a
            key={item.url}
            href={item.url}
            className={`${
              item.depth <= 2
                ? "block font-semibold mt-4"
                : "block pl-3 opacity-80"
            }`}
          >
            {item.depth <= 2 ? `> ${item.title}` : item.title}
          </a>
        ))}
      </aside>

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
            ul: ({ children }) => (
              <ul className="list-disc list-inside pl-4 space-y-2 mb-6">
                {children}
              </ul>
            ),
            li: ({ children }) => (
              <li className="text-sm opacity-80 leading-relaxed">{children}</li>
            ),
            pre: ({ children }) => (
              <pre className="my-5 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-sm leading-relaxed text-zinc-200 shadow-xl scrollbar-none">
                {children}
              </pre>
            ),
            code: ({ children }) => <code>{children}</code>,
          }}
        >
          {guide.raw}
        </ReactMarkdown>
      </main>
    </div>
  );
}
