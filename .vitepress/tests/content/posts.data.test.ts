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
    expect(typeof post.frontmatter.readTime).toBe("number");
    expect(post.frontmatter.readTime).toBeGreaterThan(0);
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
});
