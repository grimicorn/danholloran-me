import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { parseFrontmatter } from "./frontmatter";
import { SITE_URL, CURRENT_LOCATION } from "./constants";

const POSTS_DIR = join(process.cwd(), ".vitepress/content/posts");

/** Display names and ordering for the `topic` frontmatter field. */
const TOPIC_SECTIONS: { topic: string; heading: string }[] = [
  { topic: "development", heading: "Development" },
  { topic: "obsidian", heading: "Obsidian & Productivity" },
  { topic: "finance", heading: "Finance" },
  { topic: "travel", heading: "Travel & Photography" },
];

interface PostMeta {
  title: string;
  description?: string;
  topic?: string;
  date?: string;
  draft?: boolean;
  slug: string;
}

// Sort key for newest-first ordering. Posts with no date, or a date that
// fails to parse, sort to the end rather than corrupting the comparator with
// NaN (an invalid Date's getTime() is NaN, and Array.prototype.sort's order
// is unspecified once the comparator can return NaN).
function postSortTime(post: PostMeta): number {
  if (!post.date) {
    return -Infinity;
  }
  const time = new Date(post.date).getTime();
  return Number.isNaN(time) ? -Infinity : time;
}

function loadPosts(): PostMeta[] {
  return (
    readdirSync(POSTS_DIR)
      .filter((f) => f.endsWith(".md") && f !== "index.md")
      .map((file) => {
        const { data } = parseFrontmatter(
          readFileSync(join(POSTS_DIR, file), "utf-8"),
        );
        return { ...data, slug: file.replace(/\.md$/, "") } as PostMeta;
      })
      .filter((p) => !p.draft)
      // Newest first; undated posts (e.g. some travel entries) sort to the end.
      .sort((a, b) => postSortTime(b) - postSortTime(a))
  );
}

function postLine(post: PostMeta): string {
  const url = `${SITE_URL}/posts/${post.slug}`;
  const description = post.description ? `: ${post.description}` : "";
  return `- [${post.title}](${url})${description}`;
}

/**
 * Builds an llms.txt (https://llmstxt.org) for the site at build time so the
 * post list and location stay in sync with the content and
 * `.vitepress/data/location.json`.
 */
export function generateLlmsTxt(): string {
  const posts = loadPosts();
  const yearsExperience = new Date().getFullYear() - 2012;
  const place = CURRENT_LOCATION;

  const lines: string[] = [
    "# Dan Holloran",
    "",
    `> Personal blog and portfolio for Dan Holloran — a senior full-stack developer and photographer based in ${place}. The site covers front-end and full-stack web development (Vue, React, TypeScript, CSS, build tooling, and more), Obsidian and productivity workflows, and travel photography from national parks and beyond.`,
    "",
    `Dan has ${yearsExperience}+ years of experience building performant, scalable web applications and leading engineering teams, with deep expertise in Vue.js, React, Laravel, and modern JavaScript tooling. The blog mixes technical deep-dives, career reflections, and dispatches from the road.`,
    "",
    "## Main Pages",
    "",
    `- [Home](${SITE_URL}/): Landing page and overview.`,
    `- [Blog](${SITE_URL}/posts): Index of all posts — technical articles, career reflections, and travel photography.`,
    `- [Resume](${SITE_URL}/resume): Professional experience, skills, and projects.`,
  ];

  for (const { topic, heading } of TOPIC_SECTIONS) {
    const sectionPosts = posts.filter((p) => p.topic === topic);
    if (sectionPosts.length === 0) continue;
    lines.push("", `## ${heading}`, "", ...sectionPosts.map(postLine));
  }

  lines.push(
    "",
    "## Optional",
    "",
    `- [RSS Feed](${SITE_URL}/feed.xml): Full chronological feed of all posts.`,
    `- [Sitemap](${SITE_URL}/sitemap.xml): Complete list of all pages on the site.`,
    "- [GitHub](https://github.com/grimicorn): Open-source projects and code.",
    "- [LinkedIn](https://linkedin.com/in/dan-holloran/): Professional profile.",
    "",
  );

  return lines.join("\n");
}
