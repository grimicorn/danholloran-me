import { Feed } from "feed";
import { createMarkdownRenderer, type MarkdownRenderer } from "vitepress";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { parseFrontmatter } from "./frontmatter";
import { SITE_URL, SITE_DESCRIPTION } from "./constants";

const POSTS_DIR = join(process.cwd(), ".vitepress/content/posts");

// A post with no date, or a date that fails to parse, is excluded from the
// feed rather than shipping an `Invalid Date` pubDate to subscribers. Warn
// loudly on the unparseable case (as opposed to simply missing) since it
// points at a frontmatter typo rather than an intentionally undated post.
function hasParseableDate(post: Record<string, any>): boolean {
  if (!post.date) {
    return false;
  }
  const isUnparseable = Number.isNaN(new Date(post.date).getTime());
  if (isUnparseable) {
    console.warn(
      `generateFeed: skipping "${post.slug}" — unparseable date "${post.date}"`,
    );
  }
  return !isUnparseable;
}

// Reuses VitePress's own markdown pipeline (same one the site's pages render
// through) so feed content matches on-site rendering rather than a bespoke
// converter. `createMarkdownRenderer` is async; the returned renderer's
// `render` is synchronous, so it's created once and reused per post below.
function createPostRenderer(): Promise<MarkdownRenderer> {
  return createMarkdownRenderer(process.cwd());
}

function loadPosts(): Record<string, any>[] {
  const files = readdirSync(POSTS_DIR).filter(
    (f) => f.endsWith(".md") && f !== "index.md",
  );

  return files
    .map((file) => {
      const raw = readFileSync(join(POSTS_DIR, file), "utf-8");
      const { data, content } = parseFrontmatter(raw);
      const slug = file.replace(/\.md$/, "");
      return { ...data, slug, body: content } as Record<string, any>;
    })
    .filter((p) => !p.draft && hasParseableDate(p))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function generateFeed(): Promise<string> {
  const renderer = await createPostRenderer();
  const feed = new Feed({
    title: "Dan Holloran",
    description: SITE_DESCRIPTION,
    id: SITE_URL,
    link: SITE_URL,
    language: "en",
    favicon: `${SITE_URL}/favicon.ico`,
    copyright: `© ${new Date().getFullYear()} Dan Holloran`,
    feedLinks: { rss: `${SITE_URL}/feed.xml` },
    author: { name: "Dan Holloran", link: SITE_URL },
  });

  for (const post of loadPosts()) {
    const url = `${SITE_URL}/posts/${post.slug}`;
    feed.addItem({
      title: post.title,
      id: url,
      link: url,
      description: post.description ?? "",
      content: renderer.render(post.body ?? ""),
      date: new Date(post.date),
      category: post.tags?.map((t: string) => ({ name: t })) ?? [],
      image: post.image ? `${SITE_URL}${post.image}` : undefined,
    });
  }

  return feed.rss2();
}
