import { describe, it, expect, beforeAll, vi } from "vitest";
import type { ContentData } from "vitepress";
import type { PostSearchItem } from "@typedefs";

// createContentLoader is provided by vitepress at build time and throws
// outside an active vitepress process (see posts.data.test.ts for the same
// pattern); capture the transform it's handed so the tag-normalization logic
// can be exercised directly with fixtures instead of real files on disk.
let capturedTransform: (_data: ContentData[]) => PostSearchItem[];

vi.mock("vitepress", () => ({
  createContentLoader: (
    _pattern: string,
    config: { transform: typeof capturedTransform },
  ) => {
    capturedTransform = config.transform;
    return { watch: [], load: () => [] };
  },
}));

function makeRawPost(overrides: Record<string, unknown> = {}): ContentData {
  return {
    url: "/.vitepress/content/posts/example-post",
    src: undefined,
    html: undefined,
    excerpt: undefined,
    frontmatter: {
      title: "Example Post",
      draft: false,
      topic: "development",
      date: "2025-01-01T00:00:00.000Z",
      description: "An example post.",
      tags: ["javascript"],
    },
    ...overrides,
  } as ContentData;
}

describe("search.data.ts transform", () => {
  beforeAll(async () => {
    await import("../../content/posts/search.data.ts");
  });

  it("joins array tags into the keyword string", () => {
    const [item] = capturedTransform([
      makeRawPost({
        frontmatter: { ...makeRawPost().frontmatter, tags: ["js", "css"] },
      }),
    ]);

    expect(item.kw).toContain("js");
    expect(item.kw).toContain("css");
  });

  it("drops a scalar string tag instead of exploding it into characters", () => {
    const [item] = capturedTransform([
      makeRawPost({
        frontmatter: { ...makeRawPost().frontmatter, tags: "javascript" },
      }),
    ]);

    // A naive `...tags` spread of the string "javascript" would splice in
    // "j", "a", "v", ... as single-character keywords; normalizeTags guards
    // the container shape so none of that leaks into the index.
    expect(item.kw.split(" ")).not.toContain("j");
    expect(item.kw).toBe("An example post. development");
  });

  it("does not throw and drops the tag when frontmatter tags is a number", () => {
    const rawPost = makeRawPost({
      frontmatter: { ...makeRawPost().frontmatter, tags: 2025 },
    });

    expect(() => capturedTransform([rawPost])).not.toThrow();
    const [item] = capturedTransform([rawPost]);
    expect(item.kw).toBe("An example post. development");
  });

  it("handles missing tags gracefully", () => {
    const rawPost = makeRawPost({
      frontmatter: { ...makeRawPost().frontmatter, tags: undefined },
    });

    expect(() => capturedTransform([rawPost])).not.toThrow();
    const [item] = capturedTransform([rawPost]);
    expect(item.kw).toBe("An example post. development");
  });

  it("keeps only the string entries when a tags array mixes types", () => {
    const [item] = capturedTransform([
      makeRawPost({
        frontmatter: { ...makeRawPost().frontmatter, tags: ["js", 3, null] },
      }),
    ]);

    expect(item.kw).toBe("An example post. development js");
  });
});
