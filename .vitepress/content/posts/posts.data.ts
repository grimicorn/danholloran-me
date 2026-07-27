import { createContentLoader } from "vitepress";
import { calculateReadTime } from "../../theme/utils/readTime.ts";

export default createContentLoader(".vitepress/content/posts/*.md", {
  // includeSrc is needed here only so `transform` can compute readTime below;
  // the raw source is deleted before the object is returned so it never
  // reaches the client-shipped data module.
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
      .map((item) => {
        item.frontmatter.slug = item.url
          .replace(/\/.vitepress\/content\/posts\//g, "")
          .replace(/\/posts\//g, "");
        item.url = `/posts/${item.frontmatter.slug}`;
        item.frontmatter.readTime = calculateReadTime(item.src ?? "");
        delete item.src;

        return item;
      });
  },
});
