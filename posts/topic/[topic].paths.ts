import { topicBasePagePaths } from "../../.vitepress/theme/utils/archivePaths";

const POSTS_GLOB = "./.vitepress/content/posts/*.md";

// Page 1 of each topic filter, e.g. /posts/topic/development.
export default {
  watch: [POSTS_GLOB],
  paths() {
    return topicBasePagePaths();
  },
};
