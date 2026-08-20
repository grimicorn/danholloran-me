import { topicExtraPagePaths } from "../../../../.vitepress/theme/utils/archivePaths";

const POSTS_GLOB = "./.vitepress/content/posts/*.md";

// Extra pages (2..N) of each topic filter, e.g. /posts/topic/development/page/2.
export default {
  watch: [POSTS_GLOB],
  paths() {
    return topicExtraPagePaths();
  },
};
