import { describe, it, expect } from "vitest";
import projects from "@data/projects";
import loader, { buildStaticSearchItems } from "@data/staticSearch.data.ts";

describe("staticSearch data loader", () => {
  it("includes the Resume page as a page-type item", () => {
    const items = buildStaticSearchItems();
    const resume = items.find((item) => item.href === "/resume");
    expect(resume).toBeTruthy();
    expect(resume!.type).toBe("page");
  });

  it("emits a project-type item for every project", () => {
    const items = buildStaticSearchItems();
    const projectItems = items.filter((item) => item.type === "project");
    expect(projectItems.length).toBe(projects.length);
    const titles = projectItems.map((item) => item.title);
    expect(titles).toContain(projects[0].title);
  });

  it("falls back to the projects anchor when a project has no url", () => {
    const items = buildStaticSearchItems();
    const anchored = items
      .filter((item) => item.type === "project")
      .filter((item) => item.href === "/#projects");
    const urllessProjects = projects.filter((project) => !project.url);
    expect(anchored.length).toBe(urllessProjects.length);
  });

  it("carries project skills into keywords so tech searches match", () => {
    const items = buildStaticSearchItems();
    const projectWithSkills = projects.find((project) => project.skills.length);
    const match = items.find((item) => item.title === projectWithSkills!.title);
    expect(match!.kw).toContain(projectWithSkills!.skills[0].name);
  });

  it("exposes the same items through the default loader's load()", () => {
    expect(loader.load()).toEqual(buildStaticSearchItems());
  });
});
