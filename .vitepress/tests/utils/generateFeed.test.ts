import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("fs", () => {
  const readdirSync = vi.fn();
  const readFileSync = vi.fn();
  return { default: { readdirSync, readFileSync }, readdirSync, readFileSync };
});

vi.mock("../../theme/utils/frontmatter", () => ({
  parseFrontmatter: vi.fn(),
}));

import { readdirSync, readFileSync } from "fs";
import { parseFrontmatter } from "../../theme/utils/frontmatter";
import { generateFeed } from "../../theme/utils/generateFeed";
import { SITE_URL } from "../../theme/utils/constants";

const mockReaddirSync = vi.mocked(readdirSync);
const mockReadFileSync = vi.mocked(readFileSync);
const mockParseFrontmatter = vi.mocked(parseFrontmatter);

const XML_DECLARATION = '<?xml version="1.0" encoding="utf-8"?>';

// Registers a post file list and the frontmatter each file resolves to, in
// the same order generateFeed() will read them.
function mockPostFiles(
  files: string[],
  frontmatters: Record<string, unknown>[],
): void {
  mockReaddirSync.mockReturnValue(files as any);
  for (const data of frontmatters) {
    mockParseFrontmatter.mockReturnValueOnce({ data, content: "" });
  }
}

function parseFeedXml(xml: string): Document {
  return new DOMParser().parseFromString(xml, "text/xml");
}

// happy-dom's DOMParser cannot parse `<![CDATA[...]]>` sections at all (it
// treats "<![CDATA[" as an invalid start tag), so strip them before checking
// document structure. CDATA content is raw character data by definition, so
// nothing is lost from a structural well-formedness check by ignoring it.
function stripCdataSections(xml: string): string {
  return xml.replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, "");
}

// Verifies the feed both parses as valid XML and contains no bare `&`
// outside of CDATA sections — happy-dom's parser silently repairs a bare
// `&` into `&amp;` instead of erroring, so that specific regression needs
// its own check rather than relying on parsererror detection alone.
function assertWellFormedXml(xml: string): void {
  const structuralXml = stripCdataSections(xml);
  const doc = new DOMParser().parseFromString(structuralXml, "text/xml");
  expect(doc.querySelector("parsererror")).toBeNull();

  const bareAmpersandPattern =
    /&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[0-9a-fA-F]+;)/;
  expect(bareAmpersandPattern.test(structuralXml)).toBe(false);
}

// The "feed" library always wraps item titles in a CDATA section, which
// happy-dom's DOMParser can't read back out as text (see above), so titles
// are extracted from the raw XML string instead of via the DOM.
function itemTitles(xml: string): string[] {
  const itemBlocks = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
  return itemBlocks.map((block) => {
    const cdataMatch = block.match(
      /<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/,
    );
    if (cdataMatch) {
      return cdataMatch[1];
    }
    const plainMatch = block.match(/<title>([\s\S]*?)<\/title>/);
    return plainMatch ? plainMatch[1] : "";
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  mockReadFileSync.mockReturnValue("" as any);
});

describe("generateFeed", () => {
  it("produces well-formed, parseable RSS XML", () => {
    mockPostFiles(["only-post.md"], [{ title: "Hello", date: "2024-01-01" }]);

    const xml = generateFeed();

    expect(xml.startsWith(XML_DECLARATION)).toBe(true);
    assertWellFormedXml(xml);
  });

  it("returns a valid feed with no items when there are no posts", () => {
    mockReaddirSync.mockReturnValue([] as any);

    const xml = generateFeed();

    assertWellFormedXml(xml);
    expect(parseFeedXml(xml).querySelectorAll("item")).toHaveLength(0);
  });

  it("excludes index.md and non-markdown files from the feed", () => {
    mockReaddirSync.mockReturnValue([
      "index.md",
      "real-post.md",
      "notes.txt",
    ] as any);
    mockParseFrontmatter.mockReturnValueOnce({
      data: { title: "Real", date: "2024-01-01" },
      content: "",
    });

    generateFeed();

    expect(mockParseFrontmatter).toHaveBeenCalledTimes(1);
  });

  it("filters out draft posts", () => {
    mockPostFiles(
      ["draft.md", "published.md"],
      [
        { title: "Draft", date: "2024-06-01", draft: true },
        { title: "Published", date: "2024-01-01", draft: false },
      ],
    );

    expect(itemTitles(generateFeed())).toEqual(["Published"]);
  });

  it("filters out posts with no date", () => {
    mockPostFiles(
      ["no-date.md", "dated.md"],
      [{ title: "No Date" }, { title: "Dated", date: "2024-01-01" }],
    );

    expect(itemTitles(generateFeed())).toEqual(["Dated"]);
  });

  it("sorts posts newest first", () => {
    mockPostFiles(
      ["oldest.md", "newest.md", "middle.md"],
      [
        { title: "Oldest", date: "2023-01-01" },
        { title: "Newest", date: "2024-06-01" },
        { title: "Middle", date: "2024-01-01" },
      ],
    );

    expect(itemTitles(generateFeed())).toEqual(["Newest", "Middle", "Oldest"]);
  });

  it("preserves input order for posts with identical dates (stable sort)", () => {
    mockPostFiles(
      ["first.md", "second.md"],
      [
        { title: "First", date: "2024-01-01" },
        { title: "Second", date: "2024-01-01" },
      ],
    );

    expect(itemTitles(generateFeed())).toEqual(["First", "Second"]);
  });

  it("escapes special XML characters in the title without corrupting content", () => {
    const specialTitle = 'A & B <script>alert("x")</script> "quoted"';
    mockPostFiles(
      ["special.md"],
      [{ title: specialTitle, date: "2024-01-01" }],
    );

    const xml = generateFeed();

    assertWellFormedXml(xml);
    expect(itemTitles(xml)).toEqual([specialTitle]);
  });

  it("builds absolute URLs for post links and guids from the slug", () => {
    mockPostFiles(["my-cool-post.md"], [{ title: "Cool", date: "2024-01-01" }]);

    const doc = parseFeedXml(stripCdataSections(generateFeed()));
    const expectedUrl = `${SITE_URL}/posts/my-cool-post`;

    expect(doc.querySelector("item > link")?.textContent).toBe(expectedUrl);
    expect(doc.querySelector("item > guid")?.textContent).toBe(expectedUrl);
  });

  it("does not crash and omits the title element when frontmatter has no title", () => {
    mockPostFiles(["untitled.md"], [{ date: "2024-01-01" }]);

    const xml = generateFeed();

    assertWellFormedXml(xml);
    expect(parseFeedXml(xml).querySelector("item > title")).toBeNull();
  });
});
