import type { ProjectInterface, SearchItem } from "@typedefs";
import projects from "./projects";

declare const data: SearchItem[];
export { data };

// Projects without their own URL point at the home page projects section.
const PROJECTS_ANCHOR = "/#projects";

const pages: SearchItem[] = [
  {
    type: "page",
    title: "Home",
    desc: "About, projects, experience, latest posts",
    href: "/",
    kw: "home about projects experience",
  },
  {
    type: "page",
    title: "Resume",
    desc: "Full professional history & download",
    href: "/resume",
    kw: "resume cv work history",
  },
  {
    type: "page",
    title: "Blog",
    desc: "All posts, filterable by tag",
    href: "/posts/",
    kw: "blog posts writing articles",
  },
  {
    type: "page",
    title: "Grimicorn Theme",
    desc: "Calm, low-fatigue color theme — dark & light, for VS Code, terminals & more",
    href: "/themes/grimicorn",
    kw: "themes grimicorn color theme palette vscode terminal obsidian claude code dark light download",
  },
  {
    type: "page",
    title: "Grimicorn Neon",
    desc: "The always-on-rave variant — electric neon palette on near-black, for every tool",
    href: "/themes/grimicorn-neon",
    kw: "themes grimicorn neon rave color theme palette vscode terminal pink cyan dark download",
  },
];

function projectToSearchItem(project: ProjectInterface): SearchItem {
  const skillNames = project.skills.map((skill) => skill.name).join(" ");
  return {
    type: "project",
    title: project.title,
    desc: project.company,
    href: project.url ?? PROJECTS_ANCHOR,
    kw: `${project.company} ${skillNames} ${project.content}`,
  };
}

export function buildStaticSearchItems(): SearchItem[] {
  return [...pages, ...projects.map(projectToSearchItem)];
}

export default {
  load(): SearchItem[] {
    return buildStaticSearchItems();
  },
};
