import { defineConfig, defineCollection, s } from 'velite';
import rehypeSlug from 'rehype-slug';

const guides = defineCollection({
  name: 'Guide',
  pattern: 'guide/**/*.md',
  schema: s
    .object({
      title: s.string().optional(),
      slug: s.path(),
      content: s.markdown(), // converts markdown to raw HTML
      toc: s.toc(),          // automatically generates an array of headings with IDs!
    }),
});

export default defineConfig({
  root: 'content',
  collections: { guides },
  markdown: {
    rehypePlugins: [rehypeSlug],
  },
});