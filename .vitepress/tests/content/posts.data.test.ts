import { describe, it, expect, vi, beforeAll } from "vitest";

// createContentLoader is provided by vitepress at build time; capture the
// config object the loader module hands it so `transform` can be exercised
// directly, the same way the real loader would call it.
let capturedConfig: {
  includeSrc?: boolean;
  render?: boolean;
  excerpt?: boolean;
  transform: (_data: unknown[]) => unknown[];
};

vi.mock("vitepress", () => ({
  createContentLoader: (_pattern: string, config: typeof capturedConfig) => {
    capturedConfig = config;
    return { watch: [], load: () => [] };
  },
}));

function makeRawPost(overrides: Record<string, unknown> = {}) {
  return {
    // Real createContentLoader urls have the .md extension stripped;
    // excerpt is omitted here too since the loader no longer requests it
    // (excerpt: true was removed from the config) and never attaches it.
    url: "/.vitepress/content/posts/example-post",
    src: "word ".repeat(400).trim(),
    html: "<p>Rendered content</p>",
    frontmatter: {
      title: "Example Post",
      image: "/images/posts/example-post.jpg",
      draft: false,
      topic: "development",
      date: "2025-01-01T00:00:00.000Z",
      description: "An example post.",
      tags: ["javascript"],
    },
    ...overrides,
  };
}

describe("posts.data.ts loader", () => {
  beforeAll(async () => {
    await import("../../content/posts/posts.data.ts");
  });

  it("keeps includeSrc and render on but does not request excerpt", () => {
    expect(capturedConfig.includeSrc).toBe(true);
    expect(capturedConfig.render).toBe(true);
    expect(capturedConfig.excerpt).toBeUndefined();
  });

  it("returns frontmatter, url, slug, and readTime for each post", () => {
    const [transformed] = capturedConfig.transform([makeRawPost()]);
    const post = transformed as {
      url: string;
      frontmatter: Record<string, unknown>;
    };

    expect(post.url).toBe("/posts/example-post");
    expect(post.frontmatter.slug).toBe("example-post");
    expect(post.frontmatter.title).toBe("Example Post");
    // The fixture src is exactly 400 words: calculateReadTime rounds
    // wordCount / 200, so this pins the real computed value rather than
    // just asserting "some positive number".
    expect(post.frontmatter.readTime).toBe(2);
  });

  it("keeps rendered html for the post detail view but drops src", () => {
    const [transformed] = capturedConfig.transform([makeRawPost()]);
    const post = transformed as Record<string, unknown>;

    expect(post.html).toBe("<p>Rendered content</p>");
    expect(post).not.toHaveProperty("src");
  });

  it("filters out draft posts", () => {
    const draftPost = makeRawPost();
    draftPost.frontmatter = { ...draftPost.frontmatter, draft: true };

    const transformed = capturedConfig.transform([draftPost]);

    expect(transformed).toHaveLength(0);
  });

  it("sorts posts by date, newest first", () => {
    const olderPost = makeRawPost({
      url: "/.vitepress/content/posts/older-post",
      frontmatter: {
        ...makeRawPost().frontmatter,
        date: "2024-01-01T00:00:00.000Z",
      },
    });
    const newerPost = makeRawPost({
      url: "/.vitepress/content/posts/newer-post",
      frontmatter: {
        ...makeRawPost().frontmatter,
        date: "2025-06-01T00:00:00.000Z",
      },
    });

    const transformed = capturedConfig.transform([olderPost, newerPost]) as {
      frontmatter: { slug: string };
    }[];

    expect(transformed.map((post) => post.frontmatter.slug)).toEqual([
      "newer-post",
      "older-post",
    ]);
  });

  it("computes the same readTime when the loader re-transforms a cached post", () => {
    // VitePress reuses the same cached raw object across reloads (e.g. dev
    // server HMR) and re-runs transform on it. transform must not mutate
    // that object, or a second pass would see `src` already stripped and
    // silently recompute readTime from an empty string.
    const cachedRawPost = makeRawPost();

    capturedConfig.transform([cachedRawPost]);
    const [secondPass] = capturedConfig.transform([cachedRawPost]) as [
      { frontmatter: { readTime: number } },
    ];

    expect(secondPass.frontmatter.readTime).toBe(2);
  });
});
