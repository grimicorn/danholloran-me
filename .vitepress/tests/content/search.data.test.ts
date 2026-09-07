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

const DEFAULT_FRONTMATTER = {
  title: "Example Post",
  draft: false,
  topic: "development",
  date: "2025-01-01T00:00:00.000Z",
  description: "An example post.",
};

// Every case here only varies `tags`; hoisting the rest of the frontmatter
// keeps each test focused on the one thing it's proving.
function makeRawPostWithTags(tags: unknown): ContentData {
  return {
    url: "/.vitepress/content/posts/example-post",
    src: undefined,
    html: undefined,
    excerpt: undefined,
    frontmatter: { ...DEFAULT_FRONTMATTER, tags },
  } as ContentData;
}

describe("search.data.ts transform", () => {
  beforeAll(async () => {
    await import("../../content/posts/search.data.ts");
  });

  it("joins array tags into the keyword string", () => {
    const [item] = capturedTransform([makeRawPostWithTags(["js", "css"])]);

    expect(item.kw).toBe("An example post. development js css");
  });

  it("drops a scalar string tag instead of exploding it into characters", () => {
    // A naive `...tags` spread of the string "javascript" would splice in
    // "j", "a", "v", ... as single-character keywords; normalizeTags guards
    // the container shape so none of that leaks into the index.
    const [item] = capturedTransform([makeRawPostWithTags("javascript")]);

    expect(item.kw).toBe("An example post. development");
  });

  it("does not throw and drops the tag when frontmatter tags is a number", () => {
    const rawPost = makeRawPostWithTags(2025);

    expect(() => capturedTransform([rawPost])).not.toThrow();
    expect(capturedTransform([rawPost])[0].kw).toBe(
      "An example post. development",
    );
  });

  it("handles missing tags gracefully", () => {
    const rawPost = makeRawPostWithTags(undefined);

    expect(() => capturedTransform([rawPost])).not.toThrow();
    expect(capturedTransform([rawPost])[0].kw).toBe(
      "An example post. development",
    );
  });

  it("handles a bare null tags key gracefully", () => {
    // Frontmatter YAML with a bare `tags:` key (no value) parses to `null`,
    // distinct from the key being absent entirely.
    const rawPost = makeRawPostWithTags(null);

    expect(() => capturedTransform([rawPost])).not.toThrow();
    expect(capturedTransform([rawPost])[0].kw).toBe(
      "An example post. development",
    );
  });

  it("keeps only the string entries when a tags array mixes types", () => {
    const [item] = capturedTransform([makeRawPostWithTags(["js", 3, null])]);

    expect(item.kw).toBe("An example post. development js");
  });
});
