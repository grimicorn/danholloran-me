import { describe, it, expect } from "vitest";
import projects from "@data/projects";
import loader, {
  buildStaticSearchItems,
  projectToSearchItem,
  PROJECTS_ANCHOR,
} from "@data/staticSearch.data.ts";
import { mockProjects } from "../__fixtures__/mockData";

describe("staticSearch data loader", () => {
  it("indexes the full set of static pages", () => {
    const pageHrefs = buildStaticSearchItems()
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
    const items = buildStaticSearchItems();
    const projectItems = items.filter((item) => item.type === "project");
    expect(projectItems.length).toBe(projects.length);
    expect(projectItems.map((item) => item.title)).toContain(projects[0].title);
  });

  it("falls back to the projects anchor when a project has no url", () => {
    const urllessProject = { ...mockProjects[0], url: undefined };
    expect(projectToSearchItem(urllessProject).href).toBe(PROJECTS_ANCHOR);
  });

  it("falls back to the projects anchor for an empty url", () => {
    const emptyUrlProject = { ...mockProjects[0], url: "" };
    expect(projectToSearchItem(emptyUrlProject).href).toBe(PROJECTS_ANCHOR);
  });

  it("carries project skills into keywords so tech searches match", () => {
    const project = mockProjects[0];
    const item = projectToSearchItem(project);
    expect(item.kw).toContain(project.skills[0].name);
  });

  it("strips markdown link URLs from indexed keywords", () => {
    const linkProject = {
      ...mockProjects[0],
      content: "Built with [Vue.js](https://vuejs.org) and care.",
    };
    const item = projectToSearchItem(linkProject);
    expect(item.kw).toContain("Vue.js");
    expect(item.kw).not.toContain("https://vuejs.org");
  });

  it("strips image syntax and parenthesized link URLs without leaving junk", () => {
    const messyProject = {
      ...mockProjects[0],
      content:
        "See ![diagram](/img/arch.png) and [EDI](https://en.wikipedia.org/wiki/Foo_(bar)) docs.",
    };
    const item = projectToSearchItem(messyProject);
    expect(item.kw).toContain("diagram");
    expect(item.kw).toContain("EDI");
    expect(item.kw).not.toContain("wikipedia");
    expect(item.kw).not.toContain(")");
  });

  it("exposes the same items through the default loader's load()", () => {
    expect(loader.load()).toEqual(buildStaticSearchItems());
  });
});
