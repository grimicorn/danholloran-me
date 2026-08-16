import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("node:fs", () => {
  const readdirSync = vi.fn();
  const readFileSync = vi.fn();
  return { default: { readdirSync, readFileSync }, readdirSync, readFileSync };
});

vi.mock("../../theme/utils/frontmatter", () => ({
  parseFrontmatter: vi.fn(),
}));

import fs from "node:fs";
import path from "node:path";
import { parseFrontmatter } from "../../theme/utils/frontmatter";
import postsPaths from "../../../posts/[slug].paths";

const mockReaddirSync = vi.mocked(fs.readdirSync);
const mockReadFileSync = vi.mocked(fs.readFileSync);
const mockParseFrontmatter = vi.mocked(parseFrontmatter);

function generatedSlugs(): string[] {
  return postsPaths.paths().map((entry) => entry.params.slug);
}

beforeEach(() => {
  vi.clearAllMocks();
  mockReadFileSync.mockReturnValue("" as any);
});

describe("posts/[slug].paths", () => {
  it("excludes draft posts from the generated routes", () => {
    mockReaddirSync.mockReturnValue(["published.md", "draft.md"] as any);
    mockParseFrontmatter
      .mockReturnValueOnce({ data: { title: "Published" }, content: "" })
      .mockReturnValueOnce({
        data: { title: "Draft", draft: true },
        content: "",
      });

    expect(generatedSlugs()).toEqual(["published"]);
    // Guards against POSTS_DIR drifting out of sync with the watch glob: the
    // loader must read from the content posts directory it declares.
    expect(mockReadFileSync).toHaveBeenCalledWith(
      path.join("./.vitepress/content/posts", "published.md"),
      "utf-8",
    );
  });

  it("generates a route for every published post", () => {
    mockReaddirSync.mockReturnValue(["first.md", "second.md"] as any);
    mockParseFrontmatter
      .mockReturnValueOnce({ data: { title: "First" }, content: "" })
      .mockReturnValueOnce({
        data: { title: "Second", draft: false },
        content: "",
      });

    expect(generatedSlugs()).toEqual(["first", "second"]);
  });

  it("skips non-markdown files without parsing them", () => {
    mockReaddirSync.mockReturnValue(["real-post.md", "notes.txt"] as any);
    mockParseFrontmatter.mockReturnValueOnce({
      data: { title: "Real" },
      content: "",
    });

    expect(generatedSlugs()).toEqual(["real-post"]);
    expect(mockParseFrontmatter).toHaveBeenCalledTimes(1);
  });
});
