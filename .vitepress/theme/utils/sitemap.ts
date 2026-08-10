import { existsSync, statSync } from "fs";
import { join } from "path";
import type { SitemapItem } from "vitepress";
import {
  loadPublishedPosts,
  hasUsableDate,
  type PublishedPost,
} from "./loadPublishedPosts";

function indexBySlug(posts: PublishedPost[]): Map<string, PublishedPost> {
  const bySlug = new Map<string, PublishedPost>();
  for (const post of posts) {
    bySlug.set(post.slug, post);
  }
  return bySlug;
}

// Post pages carry their published date as lastmod. Returns null when the URL
// isn't a post, or the post isn't a published post with a usable date, so the
// caller can fall through to file mtime. A draft or bad-date post is not in
// the published set (the shared loader excludes drafts and warns on an
// unparseable date rather than throwing), so it falls through to mtime.
function postLastmod(
  url: string,
  publishedBySlug: Map<string, PublishedPost>,
): Date | null {
  const postSlug = url.match(/^posts\/(.+)$/)?.[1];
  if (!postSlug) {
    return null;
  }

  const post = publishedBySlug.get(postSlug);
  if (!post || !hasUsableDate(post)) {
    return null;
  }

  return new Date(post.date as string);
}

// Resolves a stripped URL to the source file that backs it, returning the final
// URL and its mtime, or null when no source file is found. Directory-index
// routes (e.g. posts/index.md) keep their trailing slash because the slashless
// form 301-redirects to it, and a sitemap must list the final URL.
function fileEntry(url: string): { url: string; lastmod: Date } | null {
  const base = url || "index";

  const filePath = join(process.cwd(), `${base}.md`);
  if (existsSync(filePath)) {
    return { url, lastmod: statSync(filePath).mtime };
  }

  const indexPath = join(process.cwd(), base, "index.md");
  if (existsSync(indexPath)) {
    return { url: url ? `${url}/` : url, lastmod: statSync(indexPath).mtime };
  }

  return null;
}

export function transformSitemapItems(items: SitemapItem[]): SitemapItem[] {
  const publishedBySlug = indexBySlug(loadPublishedPosts());
  return items
    .filter((item) => item.url !== "README")
    .map((item) => {
      const url = item.url.replace(/\/$/, "");

      const postDate = postLastmod(url, publishedBySlug);
      if (postDate) {
        return { ...item, url, lastmod: postDate };
      }

      const entry = fileEntry(url);
      if (entry) {
        return { ...item, ...entry };
      }

      return { ...item, url, lastmod: new Date() };
    });
}
