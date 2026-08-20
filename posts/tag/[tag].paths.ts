import { tagBasePagePaths } from "../../.vitepress/theme/utils/archivePaths";

const POSTS_GLOB = "./.vitepress/content/posts/*.md";

// Page 1 of each tag filter, e.g. /posts/tag/javascript.
export default {
  watch: [POSTS_GLOB],
  paths() {
    return tagBasePagePaths();
  },
};
