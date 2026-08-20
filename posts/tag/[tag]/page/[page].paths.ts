import { tagExtraPagePaths } from "../../../../.vitepress/theme/utils/archivePaths";

const POSTS_GLOB = "./.vitepress/content/posts/*.md";

// Extra pages (2..N) of each tag filter, e.g. /posts/tag/javascript/page/2.
export default {
  watch: [POSTS_GLOB],
  paths() {
    return tagExtraPagePaths();
  },
};
