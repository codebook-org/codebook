import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import { guides } from "#site/content";

export const dynamic = "force-dynamic";

class TocItem {
  title: string;
  url: string;
  depth: number;
}

function flattenToc(items: any[], depth = 1): TocItem[] {
  return items.flatMap((item) => [
    { title: item.title, url: item.url, depth },
    ...(item.items ? flattenToc(item.items, depth + 1) : []),
  ]);
}

export default function ConvertedGuide() {
  const guide = guides[0];
  const flatToc = flattenToc(guide.toc);
  const h1OnlyToc = flatToc.filter((item) => item.depth === 1);

  return (
    <div className="flex w-[calc(100vw-1rem)] h-[calc(100vh-4rem-0.5rem)] bg-monaco-dark rounded-xl border border-monaco-light mr-2 ml-2 mb-2 text-monaco-txt overflow-hidden">
      <aside className="w-64 border-r border-monaco-mid p-3 overflow-y-auto space-y-1 shrink-0 scroll-smooth">
        {h1OnlyToc.map((item) => (
          <a
            key={item.url}
            href={item.url}
            className="block text-sm text-monaco-txt hover:bg-monaco-mid rounded-lg transition-colors px-3 py-2.5"
          >
            {item.title.slice(2)}
          </a>
        ))}
      </aside>
      <main className="flex-1 px-16 overflow-y-auto scroll-smooth">
        <ReactMarkdown
          rehypePlugins={[rehypeSlug]}
          components={{
            h1: ({ id, children }) => (
              <h1
                id={id}
                className="text-zinc-100 text-2xl font-bold scroll-mt-6 mb-4"
              >
                {children}
              </h1>
            ),
            h2: ({ id, children }) => (
              <h2
                id={id}
                className="text-zinc-200 text-xl font-bold border-b border-monaco-light pb-1 scroll-mt-6 mb-4 mt-12"
              >
                {children}
              </h2>
            ),
            h3: ({ id, children }) => (
              <h3 id={id} className="text-zinc-300 font-semibold scroll-mt-6 mt-8 mb-2">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="text-sm text-zinc-400 leading-relaxed mb-4 mt-2">
                {children}
              </p>
            ),
            a: ({ href, children }) => (
              <a 
                href={href}
                target="_blank"
                rel="noopener norefferer"
                className="text-sm text-blue-500 hover:underline"
              >
                {children}
              </a>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside pl-4 space-y-2 mb-6 text-zinc-400">
                {children}
              </ul>
            ),
            li: ({ children }) => (
              <li className="text-sm leading-relaxed">{children}</li>
            ),
            pre: ({ children }) => (
              <pre className="my-5 overflow-x-auto rounded-xl border border-monaco-light bg-neutral-900 p-4 text-xs leading-relaxed text-zinc-200 scrollbar-none">
                {children}
              </pre>
            ),
          }}
        >
          {guide.raw}
        </ReactMarkdown>
        <div className="h-32" />
      </main>
    </div>
  );
}
