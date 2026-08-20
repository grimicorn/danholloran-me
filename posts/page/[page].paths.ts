import { allExtraPagePaths } from "../../.vitepress/theme/utils/archivePaths";

const POSTS_GLOB = "./.vitepress/content/posts/*.md";

// Extra pages (2..N) of the unfiltered archive. Page 1 is served by
// posts/index.md, so it is intentionally absent here.
export default {
  watch: [POSTS_GLOB],
  paths() {
    return allExtraPagePaths();
  },
};
