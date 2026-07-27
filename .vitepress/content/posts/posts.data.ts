import { createContentLoader } from "vitepress";
import { Post } from "@typedefs";
import { calculateReadTime } from "../../theme/utils/readTime.ts";

declare const data: Post[];
export { data };

export default createContentLoader(".vitepress/content/posts/*.md", {
  // includeSrc is needed here only so `transform` can compute readTime below;
  // excerpt is intentionally omitted below: no consumer reads `.excerpt`.
  //
  // render stays on, so `html` is still generated and shipped for every post
  // in this same payload — the only consumer that needs it is PostView.vue
  // (posts/[slug].md), not the list views. Splitting list metadata from post
  // detail content into two loaders would close that gap; left as a
  // follow-up since it's a larger change than trimming unused fields.
  includeSrc: true,
  render: true,
  transform(raw) {
    return raw
      .filter(({ frontmatter }) => !frontmatter.draft)
      .sort(
        (a, b) =>
          new Date(b.frontmatter.date).getTime() -
          new Date(a.frontmatter.date).getTime(),
      )
      .map(({ src, excerpt: _excerpt, ...post }) => {
        const slug = post.url
          .replace(/\/\.vitepress\/content\/posts\//g, "")
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
