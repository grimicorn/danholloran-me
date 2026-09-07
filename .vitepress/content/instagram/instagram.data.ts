import { createContentLoader } from "vitepress";
import type { InstagramContentItem } from "@typedefs";

declare const data: InstagramContentItem[];
export { data };

export default createContentLoader(".vitepress/content/instagram/*.md", {
  transform(data) {
    return data.sort(
      (a, b) =>
        new Date(b.frontmatter.created_at).getTime() -
        new Date(a.frontmatter.created_at).getTime(),
    );
  },
});
