import { createContentLoader } from "vitepress";
import { calculateReadTime } from "../../theme/utils/readTime.ts";

export default createContentLoader(".vitepress/content/posts/*.md", {
  // includeSrc is needed here only so `transform` can compute readTime below;
  // render stays on because PostView.vue (posts/[slug].md) renders `post.html`.
  // excerpt is intentionally omitted: no consumer reads `.excerpt`.
  includeSrc: true,
  render: true,
  transform(data) {
    return data
      .filter(({ frontmatter }) => !frontmatter.draft)
      .sort(
        (a, b) =>
          new Date(b.frontmatter.date).getTime() -
          new Date(a.frontmatter.date).getTime(),
      )
      .map(({ src, ...post }) => {
        const slug = post.url
          .replace(/\/.vitepress\/content\/posts\//g, "")
          .replace(/\/posts\//g, "");

        // Build a new object rather than mutating `post` in place: VitePress
        // reuses the same cached data object across reloads (e.g. dev server
        // HMR), so writing slug/readTime back onto it would leak derived
        // state into the cache and corrupt the next transform pass.
        return {
          ...post,
          url: `/posts/${slug}`,
          frontmatter: {
            ...post.frontmatter,
            slug,
            readTime: calculateReadTime(src ?? ""),
          },
        };
      });
  },
});
