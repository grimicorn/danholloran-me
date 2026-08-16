import fs from "node:fs";
import path from "node:path";
import { parseFrontmatter } from "../.vitepress/theme/utils/frontmatter";
import { isPublished } from "../.vitepress/theme/utils/loadPublishedPosts";

const POSTS_DIR = "./.vitepress/content/posts";
const MARKDOWN_EXTENSION = ".md";

// A draft must not generate a route: postsDetail.data.ts excludes it, so its
// page renders blank while pageTransform would still emit SEO metadata for it.
// Filter on the shared draft policy so drafts are dropped here exactly as they
// are in the content loaders and the SEO transform.
function isPublishedPostFile(file: string): boolean {
  if (path.extname(file) !== MARKDOWN_EXTENSION) {
    return false;
  }
  const { data } = parseFrontmatter(
    fs.readFileSync(path.join(POSTS_DIR, file), "utf-8"),
  );
  return isPublished(data);
}

export default {
  watch: ["./.vitepress/content/posts/*.md"],
  paths() {
    return fs
      .readdirSync(POSTS_DIR)
      .filter(isPublishedPostFile)
      .map((file) => {
        return { params: { slug: path.parse(file).name } };
      });
  },
};
