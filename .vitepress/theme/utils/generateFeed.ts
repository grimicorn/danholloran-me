import { Feed } from "feed";
import { createMarkdownRenderer, type MarkdownRenderer } from "vitepress";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { parseFrontmatter } from "./frontmatter";
import { SITE_URL, SITE_DESCRIPTION } from "./constants";

const POSTS_DIR = join(process.cwd(), ".vitepress/content/posts");

// `]]>` closes a CDATA section. The `feed` library wraps item content in CDATA
// and its XML serializer escapes only the first occurrence per field, so a
// body containing the sequence twice would prematurely close the section and
// corrupt the whole feed document. Neutralize every terminator by
// entity-encoding its closing bracket; a feed reader renders `]]&gt;` back to
// the original literal text.
const CDATA_TERMINATOR = "]]>";
const CDATA_TERMINATOR_SAFE = "]]&gt;";

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

function loadPosts(): Record<string, any>[] {
  const files = readdirSync(POSTS_DIR).filter(
    (file) => file.endsWith(".md") && file !== "index.md",
  );

  return files
    .map((file) => {
      const raw = readFileSync(join(POSTS_DIR, file), "utf-8");
      const { data, content } = parseFrontmatter(raw);
      const slug = file.replace(/\.md$/, "");
      return { ...data, slug, body: content } as Record<string, any>;
    })
    .filter((post) => !post.draft && hasParseableDate(post))
    .sort(
      (left, right) =>
        new Date(right.date).getTime() - new Date(left.date).getTime(),
    );
}

// Fail loud with the offending slug: a body-less feed item is worse than a
// build that stops and names the post that could not be rendered.
function renderBody(
  renderer: MarkdownRenderer,
  post: Record<string, any>,
): string {
  try {
    const html = renderer.render(post.body ?? "");
    return html.split(CDATA_TERMINATOR).join(CDATA_TERMINATOR_SAFE);
  } catch (error) {
    throw new Error(`generateFeed: failed to render "${post.slug}"`, {
      cause: error,
    });
  }
}

// `renderer` is injectable so the markdown pipeline (an external dependency)
// can be substituted in tests; the build calls `generateFeed()` with no
// argument and gets VitePress's own markdown-it, reused so feed content comes
// from the same converter the site builds with rather than a bespoke one. The
// creation call is async; the returned renderer's `render` is synchronous, so
// it's built once and reused per post.
export async function generateFeed(
  renderer?: MarkdownRenderer,
): Promise<string> {
  const markdownRenderer =
    renderer ?? (await createMarkdownRenderer(process.cwd()));
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
      content: renderBody(markdownRenderer, post),
      date: new Date(post.date),
      category: post.tags?.map((tag: string) => ({ name: tag })) ?? [],
      image: post.image ? `${SITE_URL}${post.image}` : undefined,
    });
  }

  return feed.rss2();
}
