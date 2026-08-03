import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";

// Packages needed to build the site with `vitepress build`: `.vitepress/config.ts`
// imports vitepress, @tailwindcss/vite, plist, feed, yaml, and minisearch (directly
// or via the theme utils it calls in `buildEnd`), and the theme CSS imports
// tailwindcss. Because they are used at build time, the project's dependency audit
// (`fallow audit`) requires them in `dependencies`, and a production-style install
// (`npm ci --omit=dev`) must still install them. This test fails if any regress back
// to `devDependencies`. (`vue` is also a build-time import but is intentionally
// undeclared and consumed via vitepress's transitive copy — see `.fallowrc.json`
// `ignoreDependencies` — so it is not listed here.) Paths resolve from
// `process.cwd()` (the repo root vitest runs in), matching generateFeed.ts and
// sitemap.ts.
const BUILD_TIME_DEPENDENCIES = [
  "@tailwindcss/vite",
  "feed",
  "minisearch",
  "plist",
  "tailwindcss",
  "vitepress",
  "yaml",
];

type DependencyManifest = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

function readJsonFromRoot(fileName: string): unknown {
  const filePath = join(process.cwd(), fileName);
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function readPackageJson(): DependencyManifest {
  return readJsonFromRoot("package.json") as DependencyManifest;
}

// `npm ci --omit=dev` resolves root edges from the lockfile's `packages[""]`
// block, which mirrors package.json. Asserting against it also catches a lockfile
// left stale relative to package.json (hand-edited, `npm install` never re-run).
function readLockfileRootManifest(): DependencyManifest {
  const lockfile = readJsonFromRoot("package-lock.json") as {
    packages?: Record<string, DependencyManifest>;
  };
  return lockfile.packages?.[""] ?? {};
}

function assertPlacement(describeName: string, manifest: DependencyManifest) {
  describe(describeName, () => {
    it.each(BUILD_TIME_DEPENDENCIES)("declares %s in dependencies", (name) => {
      expect(Object.keys(manifest.dependencies ?? {})).toContain(name);
    });

    it.each(BUILD_TIME_DEPENDENCIES)(
      "does not declare %s in devDependencies",
      (name) => {
        expect(Object.keys(manifest.devDependencies ?? {})).not.toContain(name);
      },
    );
  });
}

assertPlacement(
  "package.json build-time dependency placement",
  readPackageJson(),
);
assertPlacement(
  "package-lock.json build-time dependency placement",
  readLockfileRootManifest(),
);
