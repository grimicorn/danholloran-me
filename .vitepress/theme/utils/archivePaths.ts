import { loadPublishedPosts, type PublishedPost } from "./loadPublishedPosts";
import { extraPageNumbers, toFilterSlug } from "./archive";

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

function bucketsFromKeyed(
  posts: PublishedPost[],
  keysForPost: (_post: PublishedPost) => string[],
): FilterBucket[] {
  const bySlug = new Map<string, { label: string; posts: Set<string> }>();
  for (const post of posts) {
    addPostToBuckets(bySlug, post, keysForPost(post));
  }
  return [...bySlug.values()].map((bucket) => ({
    slug: toFilterSlug(bucket.label),
    label: bucket.label,
    count: bucket.posts.size,
  }));
}

function addPostToBuckets(
  bySlug: Map<string, { label: string; posts: Set<string> }>,
  post: PublishedPost,
  keys: string[],
): void {
  for (const key of keys) {
    const slug = toFilterSlug(key);
    if (slug.length === 0) {
      continue;
    }
    const bucket = bySlug.get(slug) ?? { label: key, posts: new Set<string>() };
    bucket.posts.add(post.slug);
    bySlug.set(slug, bucket);
  }
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
