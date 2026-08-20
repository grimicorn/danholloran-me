import { loadPublishedPosts, type PublishedPost } from "./loadPublishedPosts";
import { extraPageNumbers, toFilterSlug } from "./archive";

// Shared with every archive `.paths.ts` so their `watch` globs can't drift from
// where the posts actually live.
export const POSTS_WATCH_GLOB = "./.vitepress/content/posts/*.md";

// Build-time route generation for the paginated / filtered blog archive. Each
// exported function returns VitePress `paths()` entries — one per static page —
// derived from the same published-post set the content loaders expose to the
// view, so page counts and filter membership match what PostsView renders.
//
// Filter buckets are keyed by slug (not the raw label) so two labels that slug
// to the same value collapse into one page; the bucket keeps a representative
// label for display and the distinct posts that belong to it for page counts.

type ParamsEntry = { params: Record<string, string> };

interface FilterBucket {
  slug: string;
  label: string;
  count: number;
}

interface RawBucket {
  label: string;
  posts: Set<string>;
}

function bucketsFromKeyed(
  posts: PublishedPost[],
  keysForPost: (_post: PublishedPost) => string[],
): FilterBucket[] {
  const bySlug = new Map<string, RawBucket>();
  for (const post of posts) {
    addPostToBuckets(bySlug, post, keysForPost(post));
  }
  return [...bySlug.entries()].map(([slug, bucket]) => ({
    slug,
    label: bucket.label,
    count: bucket.posts.size,
  }));
}

function addPostToBuckets(
  bySlug: Map<string, RawBucket>,
  post: PublishedPost,
  keys: string[],
): void {
  for (const key of keys) {
    addPostToBucket(bySlug, post.slug, key);
  }
}

function addPostToBucket(
  bySlug: Map<string, RawBucket>,
  postSlug: string,
  key: string,
): void {
  const slug = toFilterSlug(key);
  if (slug.length === 0) {
    return;
  }
  const bucket = bySlug.get(slug) ?? { label: key, posts: new Set<string>() };
  bucket.posts.add(postSlug);
  // Deterministic representative when labels collide (e.g. "tailwind.css" vs
  // "tailwind-css"): the lexicographically smallest label wins, so the page's
  // title/heading never flips just because a post was added in a new order.
  if (key < bucket.label) {
    bucket.label = key;
  }
  bySlug.set(slug, bucket);
}

function topicBuckets(): FilterBucket[] {
  const posts = loadPublishedPosts();
  return bucketsFromKeyed(posts, (post) =>
    typeof post.topic === "string" ? [post.topic] : [],
  );
}

function tagBuckets(): FilterBucket[] {
  const posts = loadPublishedPosts();
  return bucketsFromKeyed(posts, (post) =>
    Array.isArray(post.tags) ? post.tags.map(String) : [],
  );
}

// Extra pages (2..N) of the unfiltered archive; page 1 is /posts/index.md.
export function allExtraPagePaths(): ParamsEntry[] {
  const posts = loadPublishedPosts();
  return extraPageNumbers(posts.length).map((page) => ({
    params: { page: String(page) },
  }));
}

function basePagePaths(
  buckets: FilterBucket[],
  key: "topic" | "tag",
): ParamsEntry[] {
  return buckets.map((bucket) => ({
    params: {
      [key]: bucket.slug,
      [`${key}Label`]: bucket.label,
      page: "1",
    },
  }));
}

function extraPagePaths(
  buckets: FilterBucket[],
  key: "topic" | "tag",
): ParamsEntry[] {
  return buckets.flatMap((bucket) =>
    extraPageNumbers(bucket.count).map((page) => ({
      params: {
        [key]: bucket.slug,
        [`${key}Label`]: bucket.label,
        page: String(page),
      },
    })),
  );
}

export function topicBasePagePaths(): ParamsEntry[] {
  return basePagePaths(topicBuckets(), "topic");
}

export function topicExtraPagePaths(): ParamsEntry[] {
  return extraPagePaths(topicBuckets(), "topic");
}

export function tagBasePagePaths(): ParamsEntry[] {
  return basePagePaths(tagBuckets(), "tag");
}

export function tagExtraPagePaths(): ParamsEntry[] {
  return extraPagePaths(tagBuckets(), "tag");
}
