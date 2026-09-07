import { describe, it, expect } from "vitest";
import realProjects from "@data/projects";
import {
  buildStaticSearchItems,
  buildEmptyQueryResults,
  mergeSearchIndex,
  projectToSearchItem,
  PROJECTS_ANCHOR,
  SEARCH_PANEL_SIZE,
} from "@data/searchIndex";
import { mockProjects, mockSearchItems } from "../__fixtures__/mockData";
import type { SearchItem } from "@typedefs";

describe("buildStaticSearchItems", () => {
  it("indexes the full set of static pages", () => {
    const pageHrefs = buildStaticSearchItems(mockProjects)
      .filter((item) => item.type === "page")
      .map((item) => item.href);
    expect(pageHrefs).toEqual([
      "/",
      "/resume",
      "/posts/",
      "/themes/grimicorn",
      "/themes/grimicorn-neon",
    ]);
  });

  it("emits a project-type item for every project", () => {
    const projectItems = buildStaticSearchItems(realProjects).filter(
      (item) => item.type === "project",
    );
    expect(projectItems.length).toBe(realProjects.length);
    expect(projectItems.map((item) => item.title)).toContain(
      realProjects[0].title,
    );
  });
});

describe("projectToSearchItem", () => {
  it("falls back to the projects anchor when a project has no url", () => {
    const item = projectToSearchItem({ ...mockProjects[0], url: undefined });
    expect(item.href).toBe(PROJECTS_ANCHOR);
  });

  it("falls back to the projects anchor for an empty url", () => {
    const item = projectToSearchItem({ ...mockProjects[0], url: "" });
    expect(item.href).toBe(PROJECTS_ANCHOR);
  });

  it("carries project skills into keywords so tech searches match", () => {
    const item = projectToSearchItem(mockProjects[0]);
    expect(item.kw).toContain(mockProjects[0].skills[0].name);
  });

  it("strips markdown link URLs from indexed keywords", () => {
    const item = projectToSearchItem({
      ...mockProjects[0],
      content: "Built with [Vue.js](https://vuejs.org) and care.",
    });
    expect(item.kw).toContain("Vue.js");
    expect(item.kw).not.toContain("https://vuejs.org");
  });

  it("strips image syntax and parenthesized link URLs without leaving junk", () => {
    const item = projectToSearchItem({
      ...mockProjects[0],
      content:
        "See ![diagram](/img/arch.png) and [EDI](https://en.wikipedia.org/wiki/Foo_(bar)) docs.",
    });
    expect(item.kw).toContain("diagram");
    expect(item.kw).toContain("EDI");
    expect(item.kw).not.toContain("wikipedia");
    expect(item.kw).not.toContain(")");
  });
});

describe("mergeSearchIndex", () => {
  it("keeps non-colliding static and post entries", () => {
    const staticItems = buildStaticSearchItems([]);
    const merged = mergeSearchIndex(staticItems, mockSearchItems);
    expect(merged.length).toBe(staticItems.length + mockSearchItems.length);
  });

  it("folds a project's title and keywords into a colliding post instead of dropping it", () => {
    const projectItem = projectToSearchItem({
      ...mockProjects[0],
      title: "Automation Platform",
      url: mockSearchItems[0].href,
    });
    const merged = mergeSearchIndex([projectItem], mockSearchItems);

    const entriesForHref = merged.filter(
      (item) => item.href === mockSearchItems[0].href,
    );
    expect(entriesForHref.length).toBe(1);
    const [survivor] = entriesForHref;
    expect(survivor.type).toBe("post");
    expect(survivor.kw).toContain("Automation Platform");
    expect(survivor.kw).toContain(mockSearchItems[0].kw);
  });
});

describe("buildEmptyQueryResults", () => {
  function manyProjects(count: number): SearchItem[] {
    return Array.from({ length: count }, (_unused, index) =>
      projectToSearchItem({
        ...mockProjects[0],
        title: `Project ${index}`,
        url: `https://example.com/project-${index}`,
      }),
    );
  }

  it("orders pages before posts before projects, regardless of input order", () => {
    const pageItem = buildStaticSearchItems([])[0];
    const items = [...manyProjects(2), ...mockSearchItems, pageItem];

    const result = buildEmptyQueryResults(items, SEARCH_PANEL_SIZE);

    const typeOrder = result.map((item) => item.type);
    const lastPageIndex = typeOrder.lastIndexOf("page");
    const firstProjectIndex = typeOrder.indexOf("project");
    const postIndices = typeOrder.reduce<number[]>((indices, type, index) => {
      if (type === "post") {
        indices.push(index);
      }
      return indices;
    }, []);

    expect(postIndices.length).toBeGreaterThan(0);
    expect(firstProjectIndex).toBeGreaterThan(-1);
    expect(lastPageIndex).toBeLessThan(Math.min(...postIndices));
    expect(Math.max(...postIndices)).toBeLessThan(firstProjectIndex);
  });

  it("keeps every post ahead of every project when projects outnumber the panel size", () => {
    const pageItem = buildStaticSearchItems([])[0];
    const items = [pageItem, ...manyProjects(10), ...mockSearchItems];

    const visibleTypes = buildEmptyQueryResults(items, SEARCH_PANEL_SIZE).map(
      (item) => item.type,
    );
    const lastPostIndex = visibleTypes.lastIndexOf("post");
    const firstProjectIndex = visibleTypes.indexOf("project");

    expect(lastPostIndex).toBeGreaterThan(-1);
    expect(firstProjectIndex).toBeGreaterThan(-1);
    expect(lastPostIndex).toBeLessThan(firstProjectIndex);
  });

  it("fills the panel with posts alone when there are enough to do so, excluding projects entirely", () => {
    const pageItem = buildStaticSearchItems([])[0];
    const manyPosts: SearchItem[] = Array.from({ length: 10 }, (_u, index) => ({
      type: "post",
      title: `Post ${index}`,
      desc: "",
      href: `/posts/post-${index}`,
      kw: "",
    }));
    const items = [pageItem, ...manyProjects(5), ...manyPosts];

    const visibleTypes = buildEmptyQueryResults(items, SEARCH_PANEL_SIZE).map(
      (item) => item.type,
    );

    expect(visibleTypes).not.toContain("project");
  });

  it("caps leading pages so an ever-growing pages list can't crowd out posts", () => {
    const manyPages: SearchItem[] = Array.from({ length: 10 }, (_u, index) => ({
      type: "page",
      title: `Page ${index}`,
      desc: "",
      href: `/page-${index}`,
      kw: "",
    }));
    const items = [...manyPages, ...mockSearchItems];

    const visibleTypes = buildEmptyQueryResults(items, SEARCH_PANEL_SIZE).map(
      (item) => item.type,
    );

    expect(visibleTypes.filter((type) => type === "page").length).toBeLessThan(
      manyPages.length,
    );
    expect(visibleTypes).toContain("post");
  });

  it("respects the panel size limit", () => {
    const items = [
      ...buildStaticSearchItems([]),
      ...manyProjects(5),
      ...mockSearchItems,
    ];

    const result = buildEmptyQueryResults(items, 3);

    expect(result.length).toBe(3);
  });
});
